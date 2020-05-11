const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Test = require('../models/Test');

// @route GET api/tests
// @desc Get all users tests
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const tests = await Test.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(tests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/tests
// @desc Add new test
// @access Private
router.post(
  '/',
  [auth, [check('jeu', 'Game is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jeu, text, note, type } = req.body;

    try {
      const newTest = new Test({
        jeu,
        text,
        note,
        type,
        user: req.user.id,
        userName: req.user.name,
      });

      const test = await newTest.save();

      res.json(test);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route PUT api/tests/:id
// @desc Update test
// @access Private
router.put('/:id', auth, async (req, res) => {
  const { jeu, text, note, type } = req.body;

  // Build test object
  const testFields = {};
  if (jeu) testFields.jeu = jeu;
  if (text) testFields.text = text;
  if (note) testFields.note = note;
  if (type) testFields.type = type;

  try {
    let test = await Test.findById(req.params.id);

    if (!test) return res.status(404).send({ msg: 'Test not found' });

    // Make sure user owns test
    if (test.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    test = await Test.findByIdAndUpdate(
      req.params.id,
      { $set: testFields },
      { new: true }
    );

    res.json(test);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route DELETE api/tests/:id
// @desc Delete test
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let test = await Test.findById(req.params.id);

    if (!test) return res.status(404).send({ msg: 'Test not found' });

    // Make sure test owns contact
    if (test.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Test.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
