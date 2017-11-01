var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TehsilSchema = new Schema({
  name: String,
  district: String
});

module.exports = mongoose.model('tehsils', TehsilSchema);