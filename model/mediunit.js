var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MediUnitSchema = new Schema({
  name: String
});

module.exports = mongoose.model('mediunit', MediUnitSchema)