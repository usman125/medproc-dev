var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blacklistRequestSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'vendor'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  status: {
    type: String,
    default: 'pending'
  },
  blisttime: {
    type: String,
    default: null
  },
  blistcount: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: new Date
  }
});

module.exports = mongoose.model('blacklistrequests', blacklistRequestSchema);