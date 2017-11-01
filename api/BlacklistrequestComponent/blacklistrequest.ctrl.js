// const ConfigsModel = model('configs');
// const DistrictsModel = model('districts');
// const MediTypeModel = model('meditype');
// const MediMesUnitModel = model('mediunitmeasure');
// const MediUnitModel = model('mediunit');
// const DepartmentsModel = model('departments');
// const TehsilsModel = model('tehsils');
// const ZonesModel = model('zones');

const UserModel = model('user');
const BlacklistrequestModel = model('blacklistrequest');
var mongoose = require('mongoose');

exports.addBlacklistRequest = function(req, res, next){
    // res.send("all Blacklisted vendors");
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='user'){
            // ConfigsModel.find(function(err, configs){
            //     if(err){
            //         res.json(err)    
            //     }
            //     res.json([{status:1,message:'Access Granted',configs:configs}]); 
            //  });
            var newRequest = new BlacklistrequestModel({
                vendorId:req.body.vendorId,
                userId:req.body.userId
            });
            newRequest.save(function(err, result){
                if(err){
                    res.json(err)    
                }
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
            // BlacklistrequestModel.update({ 
            //     $push: { 
            //         users: {_id: mongoose.Types.ObjectId(req.body.userId)} 
            //     } 
            // },{multi:true, upsert:true}, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    }); 
}
exports.allBlacklistRequests = function(req, res, next){
    // res.send("all Blacklisted vendors");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='user'){
            BlacklistrequestModel.find(function(err, requests){
                if(err){
                    res.json(err)    
                }
                res.json([{status:1,message:'Access Granted',requests:requests}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',requests:[]}]);
        }
    }); 
}
