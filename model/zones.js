var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var zoneSchema = new Schema({
  name: String
});

module.exports = mongoose.model('zones', zoneSchema);