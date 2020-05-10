const mongoose = require('mongoose');

const TestSchema = mongoose.Schema({
  jeu: {
    type: String,
    required: true,
  },
  test: {
    type: String,
    required: true,
    unique: true,
    text: true,
  },
  note: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Test', TestSchema);
