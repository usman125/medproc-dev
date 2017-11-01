const TechQualificationModel = model('techqualification');
const UserModel = model('user');
var mongoose = require('mongoose');

exports.allTechQualiProfiles = function(req, res, next){
  // res.send("all Qualification profiles");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo' || user.role==='admin' || user.role==='pco'){
      TechQualificationModel.find(function(err, profiles){
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
exports.getSingleTechProfile = function(req, res, next){
  // res.send("all Qualification profiles");
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo' || user.role==='pco'){
      TechQualificationModel.find()
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
exports.addTechQualiProfile = function(req, res, next){
  console.log(req.body.profilename);
  var profilename =  req.body.profilename;
  console.log(req.body.profileschema);
  var profileschema = req.body.profileschema;
  // res.json("add Qualification profiles");
  var newProfile = new TechQualificationModel({profilename: profilename,
                                               profileschema: profileschema,
                                               profiletotalmarks: req.body.profiletotalmarks,
                                               profilepassmarks: req.body.profilepassmarks,
                                               totalknockdown: req.body.totalknockdown,
                                               totalweitage: req.body.totalweitage});

  UserModel.findById(req.body.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='deo' || user.role==='pco'){
      newProfile.save(function(err, result){
        if(err){ res.json(err); }
        res.json([{status:1,message:'Access Granted',result:result}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',result:null}]);
    }
  })
}