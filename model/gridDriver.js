const mongoose = require('mongoose');

const gridDriverSchema = new mongoose.Schema({
  broadcast_name: {
    type: String,
    required: true,
  },
  country_code: {
    type: String,
    default: null,
  },
  first_name: {
    type: String,
    default: null,
  },
  full_name: {
    type: String,
    required: true,
  },
  headshot_url: {
    type: String,
    default: null,
  },
  last_name: {
    type: String,
    default: null,
  },
  driver_number: {
    type: Number,
    required: true,
  },
  team_colour: {
    type: String,
    default: null,
  },
  team_name: {
    type: String,
    default: null,
  },
  name_acronym: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

module.exports = mongoose.model('gridDriver', gridDriverSchema);
