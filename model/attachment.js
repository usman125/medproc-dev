var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttachmentSchema = new Schema({
	filename: String
});

module.exports = mongoose.model('attachment', AttachmentSchema);