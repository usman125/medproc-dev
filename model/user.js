var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  	name: String,
	email: {
		type: String,
		required: [ true, 'Email is n Required feild' ],
		validate: {
			validator: function(v) {
				if(v.length>0) 
					return /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(v);
				else
					return true;
			},
			"message": "{VALUE} is not a valid email"
		}
	},
	password: {
		type: String,
		required: [ true, 'Password is a required field' ]
	},	
	username: {
		type: String,
		required: [ true, 'Password is a required field' ]
	},	
	district: [{
		_id: Schema.Types.ObjectId,
		name: String
	}],
	tehsil: [{
		_id: Schema.Types.ObjectId,
		name: String
	}],
	department: [{
		_id: Schema.Types.ObjectId,
		name: String
	}],
	designation: {
		type: String
	},
	role: {
		type: String
	},

  is_verified: {
		type: Boolean,
		default: false
	},
	is_active: {
		type: Boolean,
		default: true
	},
	token: [ String ],
  created_at: {
		type: Date,
		default: new Date
  },
  subscription: {
		type: Schema.ObjectId,
		ref: 'package'
  },
  settings: Schema.Types.Mixed
});

module.exports = mongoose.model('users', UserSchema);