const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Gamer = require('../models/Gamer');
const Games = require('../models/Games');

// @route POST api/gamers
// @desc Register a gamer
// @access Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, admin } = req.body;

    try {
      let gamer = await Gamer.findOne({ email });

      if (gamer) {
        return res.status(400).json({ msg: 'gamer already exists' });
      }

      gamer = new Gamer({
        name,
        email,
        password,
        admin,
      });

      const salt = await bcrypt.genSalt(10);

      gamer.password = await bcrypt.hash(password, salt);

      await gamer.save();

      const payload = {
        gamer: {
          id: gamer.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server erreur');
    }
  }
);

// @route    GET api/user/me
// @desc     Get current user
// @access   Private
router.get('/me/:id', auth, async (req, res) => {
  try {
    const gamer = await Gamer.findOne({
      gamer: req.gamer._id,
    }).populate('gamer', ['name']);

    if (!gamer) {
      return res.status(400).json({ msg: 'There is no gamer' });
    }

    res.json(gamer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public
// Dont work for now
router.get('/user/:gamer_id', async (req, res) => {
  try {
    const gamer = await Gamer.findOne({
      gamer: req.params.gamer_id,
    }).populate('gamer', ['name']);

    if (!gamer) return res.status(400).json({ msg: 'gamer not found' });

    res.json(gamer);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'gamer not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Games.deleteMany({ gamer: req.gamer.id });
    // Remove gamer
    await Gamer.findOneAndRemove({ _id: req.gamer.id });

    res.json({ msg: 'Gamer deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
