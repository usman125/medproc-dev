var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicine = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  mediunit: String,
  meditype: String,
  medisize: String,
  dosage: String,
  quantity: String,
  sgtdquantity: String,
  reason: String,
  estprice: String,
  northbid: Number,
  southbid: Number,
  centralbid: Number,
  northvendorname: String,
  southvendorname: String,
  centralvendorname: String,
  northvendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
  southvendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
  centralvendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  }
});

var FinancialBiddingSchema = new Schema({
  tendername: String,
  vendorname: String,
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
	tender: {
    type: Schema.Types.ObjectId,
    ref: 'tender'
  },
	medicine: [medicine]
});

module.exports = mongoose.model('financialbidding', FinancialBiddingSchema);