var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DistrictSchema = new Schema({
  name: String,
  zone: String
});

module.exports = mongoose.model('districts', DistrictSchema);