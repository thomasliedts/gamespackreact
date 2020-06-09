const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Gamer = require('../models/Gamer');
const Games = require('../models/Games');

// @route GET api/tests
// @desc Get all users tests
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const games = await Games.find({ gamer: req.gamer.id }).sort({
      date: -1,
    });
    res.json(games);
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
  [
    auth,
    [
      check('jeu', 'Game is required').not().isEmpty(),
      check('genre', 'Definir le genre du jeu').not().isEmpty(),
      check('plateforms', 'Definir les plateformes sur lequel le jeu est sorti')
        .not()
        .isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jeu, genre, plateforms } = req.body;

    try {
      const gamer = await Gamer.findById(req.gamer.id).select('-password');

      if (!gamer.admin) {
        return res.json({ msg: 'Tu ne peux pas publier de jeu' });
      } else {
        const newGames = new Games({
          jeu,
          genre,
          plateforms,
          gamer: req.gamer.id,
        });

        const game = await newGames.save();

        res.json(game);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

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

// @route PUT api/tests/:id
// @desc Update test
// @access Private
router.put('/:id', auth, async (req, res) => {
  const { jeu, genre, plateforms } = req.body;

  // Build test object
  const gameFields = {};
  if (jeu) gameFields.jeu = jeu;
  if (genre) gameFields.genre = genre;
  if (plateforms) gameFields.plateforms = plateforms;

  try {
    let game = await Games.findById(req.params.id);

    if (!game) return res.status(404).send({ msg: 'game not found' });

    // Make sure gamer owns game
    if (game.gamer.toString() !== req.gamer.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    game = await Games.findByIdAndUpdate(
      req.params.id,
      { $set: gameFields },
      { new: true }
    );

    res.json(game);
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
    let game = await Games.findById(req.params.id);

    if (!game) return res.status(404).send({ msg: 'game not found' });

    // Make sure test owns contact
    if (game.gamer.toString() !== req.gamer.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Games.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Test removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
