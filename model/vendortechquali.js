var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vendorTechQualiSchema = new Schema({
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
    ref: 'techqualification'
  },
  profileschema: [{}],
  vendorstatus: String

});

module.exports = mongoose.model('vendortechquali', vendorTechQualiSchema);