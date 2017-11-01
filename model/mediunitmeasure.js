var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var MediUnitMeasureSchema = new Schema({
  name: String
});

module.exports = mongoose.model('mediunitmeasure', MediUnitMeasureSchema)