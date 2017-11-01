var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tehsil = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var department = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var facilitytype = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var facilities = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var meditype = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var mediunit = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});
var mediunitmeasure = new Schema({
  _id: Schema.Types.ObjectId,
  name: String
});

var configSchema = new Schema({
  tehsil: [tehsil],
  department: [department],
  facilitytype: [facilitytype],
  facilities: [facilities],
  meditype: [meditype],
  mediunit: [mediunit],
  mediunitmeasure: [mediunitmeasure]
});

module.exports = mongoose.model('configs', configSchema);