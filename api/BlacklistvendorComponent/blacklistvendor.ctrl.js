// const ConfigsModel = model('configs');
// const DistrictsModel = model('districts');
// const MediTypeModel = model('meditype');
// const MediMesUnitModel = model('mediunitmeasure');
// const MediUnitModel = model('mediunit');
// const DepartmentsModel = model('departments');
// const TehsilsModel = model('tehsils');
// const ZonesModel = model('zones');
const VendorModel = model('vendor');

const UserModel = model('user');
const BlacklistrequestModel = model('blacklistrequest');
var mongoose = require('mongoose');

exports.allRequestedVendors = function(req, res, next){
    // res.send("all Blacklisted vendors");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='user'){
            BlacklistrequestModel.aggregate([
                  // Stage 1
                  // {
                  //   $match: {
                    
                  //      status: "pending"

                  //   }
                  // },
                   // Stage 2
                  {
                    $group: {
                    
                       _id: null, distinct: {$addToSet: "$vendorId"} 
                    
                    }
                  },

                  // Stage 3
                  {
                    $lookup: {
                        "from" : "vendors",
                        "localField" : "distinct",
                        "foreignField" : "_id",
                        "as" : "vendors"
                    }
                  }
            ]).exec(function(err, requests){
                if(err){
                    res.json(err)    
                }
                res.json([{status:1,message:'Access Granted',requests:requests[0]}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',requests:[]}]);
        }
    }); 
}
exports.allBlacklistedVendors = function(req, res, next){
    // res.send("all Blacklisted vendors");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='user'){
            BlacklistrequestModel.aggregate([
                  //Stage 1
                  {
                    $match: {
                    
                       status: "blacklisted"

                    }
                  },
                   // Stage 2
                  {
                    $group: {
                    
                       _id: null, distinct: {$addToSet: "$vendorId"} 
                    
                    }
                  },

                  // Stage 3
                  {
                    $lookup: {
                        "from" : "vendors",
                        "localField" : "distinct",
                        "foreignField" : "_id",
                        "as" : "vendors"
                    }
                  }
            ]).exec(function(err, vendors){
                if(err){
                    res.json(err)    
                }
                res.json([{status:1,message:'Access Granted',vendors:vendors}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',vendors:[]}]);
        }
    }); 
}

exports.getVendorStats = function(req, res, next){
    // res.send("all Blacklisted vendors");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            BlacklistrequestModel.aggregate([
                // Stage 1
                {
                    $match: {
                    vendorId: mongoose.Types.ObjectId(req.query.vendorId)
                    }
                },
                 // Stage 2
                {
                    $unwind: "$userId"
                },
                 // Stage 3
                {
                    $lookup:{
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "userinfo"
                    }
                },
                 // Stage 4
                {
                    $unwind: "$vendorId"
                },
                 // Stage 5
                {
                    $lookup:{
                        "from": "vendorcontracts",
                        "localField": "vendorId",
                        "foreignField": "vendorId",
                        "as": "contractsinfo"
                    }
                },
                 // Stage 6
                {
                    $unwind: "$vendorId"
                },
                 // Stage 7
                {
                    $lookup:{
                        "from": "vendors",
                        "localField": "vendorId",
                        "foreignField": "_id",
                        "as": "vendorinfo"
                    }
                }


            ]).exec(function(err, stats){
                if(err){
                    res.json(err)    
                }
                res.json([{status:1,message:'Access Granted',stats:stats}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',stats:[]}]);
        }
    }); 
}
exports.approveBlacklist = function(req, res, next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            console.log("DURATION FO VENDOR GETTING BLOCKED:--", req.query.blisttime);
            BlacklistrequestModel.update({vendorId:req.query.vendorId},{$set:{ blisttime: req.query.blisttime,
                    blistcount: req.query.blistcount,
                    status: "blacklisted"}},{ multi: true,upsert: true}
            ,function(err, result){
                if(err) res.json(err)
                res.json([{status:1,message:'Access Granted',result:result}])
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    });
}

