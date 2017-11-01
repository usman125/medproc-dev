var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DepartmentSchema = new Schema({
  name: String,
  
});

module.exports = mongoose.model('departments', DepartmentSchema);