var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NavbarSchema = new Schema({
	name: String,
	route: String,
	role: String
});

module.exports = mongoose.model('navbar', NavbarSchema);