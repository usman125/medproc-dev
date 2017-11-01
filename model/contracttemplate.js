var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contractTemplateSchema = new Schema({
  name: String,
  profiletext: String
});

module.exports = mongoose.model('contracttemplates', contractTemplateSchema);