var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VendorContractSchema = new Schema({
  tenderId: {
    "type":Schema.ObjectId,
    "ref":"tender"
  },
  vendorId: {
    "type":Schema.ObjectId,
    "ref":"vendor"
  },
  contractprofileId: {
    "type":Schema.ObjectId,
    "ref":"contracttemplate"
  },
  contractprofiletext: String,
  contractdate: String,
  created_at: {
    type: Date,
    default: new Date
  }
});

module.exports = mongoose.model('vendorcontract', VendorContractSchema);