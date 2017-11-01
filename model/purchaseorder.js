var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicine = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  mediunit: String,
  meditype: String,
  quantity: String,
  remainingquantity: String,
  demandedquantity: String,
  recievedquantity: String,
  sgtdquantity: String,
  reason: String,
  estprice: String,
  bidamount: Number
});

var PurchaseOrderSchema = new Schema({
  tendername: String,
  leadtime: String,
  ponumber: String,
  recievedquantity: String,
  isverified: String,
  islate: String,
  fileref: String,
  createdat: String,
	tender: {
    type: Schema.Types.ObjectId,
    ref: 'tender'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  vendorname: String,
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
	medicine: [medicine]
});

module.exports = mongoose.model('purchaseorder', PurchaseOrderSchema);