const mongoose = require('mongoose');

const { Schema } = mongoose;

// user schema key naming convention is in snake case
const userModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },

},
  { timestamps: true }
);



module.exports = mongoose.model('user', userModel);
