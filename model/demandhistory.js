var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var medicine = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  unit: String,
  quantity: String,
  sgtdquantity: String,
  reason: String,
  estprice: String
});

var DemandHistorySchema = new Schema({
  demand: {
    type: Schema.Types.ObjectId,
    ref: 'demand'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
	medicine: [medicine]
});

module.exports = mongoose.model('demandhistory', DemandHistorySchema);