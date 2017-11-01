var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TenderSchema = new Schema({
    name: String,
    fiscalyear: String,
    tenderdate: String,
    demanddateto: String,
    demanddatefrom: String,
    islocked: {
        type:String,
        default:"0"
    },    
    isclosed: {
        type:String,
        default:"0"
    },
    advdate: String,
    department: [{
        _id: Schema.Types.ObjectId,
        name: String
    }],
    prequaliprofile:{
        type: Schema.ObjectId,
        ref: 'prequalification'
    },
    techqualiprofile:{
        type: Schema.ObjectId,
        ref: 'techqualification'
    },
    pubinnews: String,
    filefornews: String,
    pubinppra: String,
    filefortender: String,
    prequalification: String,
});

module.exports = mongoose.model('tenders', TenderSchema);