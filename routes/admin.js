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

module.exports = router;
