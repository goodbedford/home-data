let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Room = require('./room');
let ObjectId = Schema.Types.ObjectId;

let HomeSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
  },
  rooms: [{type: ObjectId, ref: 'Room'}],

});

module.exports = mongoose.model('Home', HomeSchema);
