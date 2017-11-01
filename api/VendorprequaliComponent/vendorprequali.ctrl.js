const VendorPreQualiModel = model('vendorprequali');
const UserModel = model('user');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.allVendorPreQualiProfiles = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorPreQualiModel.find(function(err, profiles){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',profiles:profiles}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',profiles:[]}]);
    }
  });
}
exports.addVendorPreQualiProfile = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.body.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      // VendorPreQualiModel.find(function(err, profiles){
      //   if(err) {
      //     res.json(err)
      //   }
      //   res.json([{status:1,message:'Access Granted',profiles:profiles}]);
      // });
      var newPreQualiPro = new VendorPreQualiModel({
        vendorId: req.body.vendorId,
        tenderId: req.body.tenderId,
        qualiprofileId: req.body.qualiprofileId,
        profileschema: req.body.profileschema,
        vendorstatus: req.body.vendorstatus
      });
      newPreQualiPro.save(function(err, result){
        if(err) res.send(err)
        res.json([{status:1,message:'Access Granted',result:result}]);
      });
      // res.json("add vendor pre qualification");
    }
    else {
      res.json([{status:0,message:'Access Denied',result:[]}]);
    }
  });
}
exports.editVendorPreQualiProfile = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorPreQualiModel.find({vendorId: req.query.vendorId, qualiprofileId: req.query.qualiprofileId}, function(err, profile){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',profile:profile}]);
      });
      // res.json("add vendor pre qualification");
    }
    else {
      res.json([{status:0,message:'Access Denied',profiles:[]}]);
    }
  });
}
exports.updateVendorPreQualiProfile = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.body.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorPreQualiModel.update({vendorId: req.body.vendorId, qualiprofileId: req.body.qualiprofileId},
        {$set:{profileschema:req.body.profileschema, vendorstatus:req.body.vendorstatus}}, function(err, result){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',result:result}]);
      });
      // res.json("add vendor pre qualification");
    }
    else {
      res.json([{status:0,message:'Access Denied',result:[]}]);
    }
  });
}
exports.getPreQualiedVendors = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      console.log("tender Id: ", req.query.qualiprofileId);
      VendorPreQualiModel.aggregate(

        // Pipeline
        [
          // Stage 1
          {
            $match: {
                // enter query here
                vendorstatus: "qualify",
                qualiprofileId: mongoose.Types.ObjectId(req.query.qualiprofileId)
            }
          },

          // Stage 2
          {
            $lookup: {
                "from" : "vendors",
                "localField" : "vendorId",
                "foreignField" : "_id",
                "as" : "vendorinfo"
            }
          },

        ]



      ).exec(function(err, vendors){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',vendors:vendors}]);
        
      });
      // res.json("add vendor pre qualification");
    }
    else {
      res.json([{status:0,message:'Access Denied',vendors:[]}]);
    }
  });
}
