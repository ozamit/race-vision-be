const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  session_key: {
    type: Number,
    required: true,
    unique: true
  },
  session_name: {
    type: String,
    required: true
  },
  date_start: {
    type: Date,
    required: true
  },
  date_end: {
    type: Date,
    required: true
  },
  gmt_offset: {
    type: String,
    required: true
  },
  session_type: {
    type: String,
    required: true,
  },
  meeting_key: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country_key: {
    type: Number,
    required: true
  },
  country_code: {
    type: String,
    required: true
  },
  country_name: {
    type: String,
    required: true
  },
  circuit_key: {
    type: Number,
    required: true
  },
  circuit_short_name: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
