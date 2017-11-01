var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendorSchema = new Schema({
  name: String,
  address: String,
  city: String,
  phonenumber: String,
  email: String,
  website: String,
  dateofestablishment: Date,
  businesstype: String,
  focalpersonname: String,
  focalpersonnumber: String,
  is_active: {
    type: Boolean,
    default: true
  },
  is_qualified: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('vendors', VendorSchema);