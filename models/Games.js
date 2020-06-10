const mongoose = require('mongoose');

const GamesSchema = mongoose.Schema({
  gamer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gamer',
  },
  jeu: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
  },
  plateforms: {
    type: String,
    required: true,
  },
  tests: [
    {
      text: {
        type: String,
        required: true,
        unique: true,
        text: true,
      },
      note: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      gamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gamer',
      },
    },
  ],
});

module.exports = mongoose.model('Games', GamesSchema);
