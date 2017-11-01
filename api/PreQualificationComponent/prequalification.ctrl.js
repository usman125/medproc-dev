const PreQualificationModel = model('prequalification');
const UserModel = model('user');
var mongoose = require('mongoose');

exports.allPreQualiProfiles = function(req, res, next){
  // res.send("all Qualification profiles");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo' || user.role==='admin' || user.role==='pco'){
      PreQualificationModel.find(function(err, profiles){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',profiles:profiles}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',profiles:[]}]);
    }
  }) 
}
exports.getSingleProfile = function(req, res, next){
  // res.send("all Qualification profiles");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo'){
      PreQualificationModel.find()
                       .where('_id')
                       .equals(req.query.profileId)
                       .exec(function(err, profile){
                          if(err){
                            res.json(err);
                          }
                          res.json([{status:1,message:'Access Granted',profile:profile}]);
                       });
    }
    else {
      res.json([{status:0,message:'Access Denied',profile:null}]);
    }
  }) 
} 
exports.addPreQualiProfiles = function(req, res, next){
  console.log(req.body.profilename);
  var profilename =  req.body.profilename;
  console.log(req.body.profileschema);
  var profileschema = req.body.profileschema;
  // res.json("add Qualification profiles");
  var newProfile = new PreQualificationModel({profilename: profilename,
                                               profileschema: profileschema,
                                               profiletotalmarks: req.body.profiletotalmarks,
                                               profilepassmarks: req.body.profilepassmarks,
                                               totalknockdown: req.body.totalknockdown,
                                               totalweitage: req.body.totalweitage});
  UserModel.findById(req.body.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo'){
      newProfile.save(function(err, result){
                                              
   
        if(err){ res.send(err); }
        res.json([{status:1,message:'Access Granted',result:result}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',result:null}]);
    }
  });
}
