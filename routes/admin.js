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

module.exports = router;
