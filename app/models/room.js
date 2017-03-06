let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let RoomSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  thermostat: {
    type: Number,
    min: 0,
    max: 130,
    default: 55,
  },
  curtains: {
    type: Boolean,
    default: false,
  },
  lights: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Room', RoomSchema);
