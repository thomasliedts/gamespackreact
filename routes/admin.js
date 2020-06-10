const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Gamer = require('../models/Gamer');
const Games = require('../models/Games');

// @route    GET api/gamer
// @desc     Get current gamers
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const gamer = await Gamer.findById(req.gamer.id).select('-password');

    if (!gamer.admin) {
      return res.json({ msg: 'Tu ne peux pas accéder à ceci' });
    } else {
      const gamer = await Gamer.find().populate('gamer', ['name']);

      if (!gamer) {
        return res
          .status(400)
          .json({ msg: 'There is no gamer for this gamer' });
      }

      res.json(gamer);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/games
// @desc Add new test
// @access Private
router.post(
  '/games',
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
    const gamer = await Gamer.findById(req.gamer.id).select('-password');
    if (!gamer.admin) {
      return res.json({ msg: 'Tu ne peux pas mettre à jour le jeu' });
    } else {
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
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
//Delete a test

router.delete('/:id/:test_id', auth, async (req, res) => {
  try {
    const gamer = await Gamer.findById(req.gamer.id).select('-password');

    if (!gamer.admin) {
      return res.json({ msg: 'Tu ne peux pas supprimer ce test' });
    } else {
      let game = await Games.findById(req.params.id);

      const test = game.tests.find((test) => test.id === req.params.test_id);
      console.log(test);
      if (!test) return res.status(404).send({ msg: 'test not found' });

      //  Get remove index
      const removeIndex = game.tests.map((test) => test.toString()).indexOf();
      game.tests.splice(removeIndex, 1);

      await game.save();

      res.json({ msg: 'Test removed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
