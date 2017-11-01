var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PreQualificationSchema = new Schema({
  profilename: String,
  profileschema: [{}],
  profiletotalmarks: Number,
  profilepassmarks: Number,
  totalknockdown: Number,
  totalweitage: Number,
  created_at: {
    type: Date,
    default: new Date
  }
});

module.exports = mongoose.model('prequaliprofiles', PreQualificationSchema);