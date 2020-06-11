const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Gamer = require('../models/Gamer');
const Games = require('../models/Games');

// @route GET api/games
// @desc Get all users tests
// @access Private
router.get('/', async (req, res) => {
  try {
    const games = await Games.find();
    res.json(games);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route PUT api/games/tests/:id
// @desc Update test
// @access Private
router.put(
  '/tests/:id',
  [
    auth,
    [
      check('text', 'Text is required').not().isEmpty(),
      check('note', 'Note is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const gamer = await (await Gamer.findById(req.gamer.id)).isSelected(
        '-password'
      );
      const games = await Games.findById(req.params.id);

      const newTest = {
        text: req.body.text,
        note: req.body.note,
        name: gamer.name,
        gamer: req.gamer.id,
      };
      games.tests.unshift(newTest);

      await games.save();

      res.json(games.tests);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route DELETE api/games/:id
// @desc Delete test
// @access Private
router.delete('/tests/:id/:test_id', auth, async (req, res) => {
  try {
    let game = await Games.findById(req.params.id);

    const test = game.tests.find((test) => test.id === req.params.test_id);

    if (!test) return res.status(404).send({ msg: 'test not found' });

    // Check gamer
    if (test.gamer.toString() !== req.gamer.id) {
      return res.status(401).json({ msg: 'Gamer not authorized' });
    }

    //  Get remove index
    const removeIndex = game.tests
      .map((test) => test.toString())
      .indexOf(req.gamer.id);
    game.tests.splice(removeIndex, 1);

    await game.save();

    res.json({ msg: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
