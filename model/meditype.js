var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MediTypeSchema = new Schema({
  name: String
});

module.exports = mongoose.model('meditype', MediTypeSchema)