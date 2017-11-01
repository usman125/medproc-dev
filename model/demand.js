var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicine = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  mediunit: String,
  medisize: String,
  meditype: String,
  dosage: String,
  quantity: String,
  sgtdquantity: String,
  reason: String,
  estprice: String
});

var DemandSchema = new Schema({
	year: String,
	district: {
    type: Schema.Types.ObjectId,
    ref: 'district'
  },
  districtname: String,
  districtzone: String,
  tendername: String,
  departmentname: String,
  demandstatus: String,
  demandestprice: String,
  department: {
    type: Schema.Types.ObjectId,
    ref: 'department'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
	tenderref: {
    type: Schema.Types.ObjectId,
    ref: 'tender'
  },
	medicine: [medicine]
});

module.exports = mongoose.model('demand', DemandSchema);