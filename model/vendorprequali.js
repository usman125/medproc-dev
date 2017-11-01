var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vendorPreQualiSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
  tenderId: {
    type: Schema.Types.ObjectId,
    ref: 'tender'
  },
  qualiprofileId: {
    type: Schema.Types.ObjectId,
    ref: 'prequalification'
  },
  profileschema: [{}],
  vendorstatus: String

});

module.exports = mongoose.model('vendorprequali', vendorPreQualiSchema);