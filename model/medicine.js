var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicineSchema = new Schema({
	name: String,
	filereference: String,
	mediunit: String,
	medisize: String,
	meditype: String,
	dosage: String,
	sgtdquantity: String,
	medigenre: String,
	estprice: String,
	chemicalname: String,
	department: {
    type: Schema.Types.ObjectId,
    ref: 'department'
	}
});

module.exports = mongoose.model('medicine', MedicineSchema);