const VendorTechQualiModel = model('vendortechquali');
const UserModel = model('user');
var mongoose = require('mongoose');


exports.allVendorTechQualiProfiles = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorTechQualiModel.find(function(err, profiles){
        if(err) {
          res.json(err)
        }
        console.log("Profile",profiles)
        res.json([{status:1,message:'Access Granted',profiles:profiles}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',profiles:[]}]);
    }
  });
}
exports.addVendorTechQualiProfile = function(req, res, next){
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
      var newTechQualiPro = new VendorTechQualiModel({
        vendorId: req.body.vendorId,
        tenderId: req.body.tenderId,
        qualiprofileId: req.body.qualiprofileId,
        profileschema: req.body.profileschema,
        vendorstatus: req.body.vendorstatus
      });
      newTechQualiPro.save(function(err, result){
        if(err) res.send(err)
        res.json([{status:1,message:'Access Granted',result:result}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',result:[]}]);
    }
  });
}
exports.editVendorTechQualiProfile = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorTechQualiModel.find({vendorId: req.query.vendorId, qualiprofileId: req.query.qualiprofileId}, function(err, profile){
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
exports.updateVendorTechQualiProfile = function(req, res, next){
  // res.send("ALL VENDOR PRE QUALIFICATIONS");
  UserModel.findById(req.body.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorTechQualiModel.update({vendorId: req.body.vendorId, qualiprofileId: req.body.qualiprofileId},
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
