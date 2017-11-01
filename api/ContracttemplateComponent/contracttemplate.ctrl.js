const ContractTemplateModel = model('contracttemplate');
const UserModel = model('user');
var mongoose = require('mongoose');

exports.getAllContractTemplates = function(req, res, next){
  // res.send("GET ALL CONTRACT TEMPLATES API");
      UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='pco' || user.role==='deo'){
          ContractTemplateModel.find(function(err, results){
            if(err){
                res.json(err)    
            }
            res.json([{status:1,message:'Access Granted',results:results}]); 
        });
        }
        else {
          res.json([{status:0,message:'Access Denied',results:[]}]);
        }
    }); 
}
exports.addContractTemplate = function(req, res, next){
  // res.send("GET ALL CONTRACT TEMPLATES API");
      UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='pco' || user.role==='deo'){
          var newTemplate = new ContractTemplateModel({name:req.body.name, profiletext:req.body.profiletext});
          newTemplate.save(function(err, result){
            if(err) res.json(err)
            res.json([{status:1,message:'Access Granted',result:result}]);
          })
        }
        else {
          res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    }) 
}
exports.getSingleTemplate = function(req, res, next){
  // res.send("GET ALL CONTRACT TEMPLATES API");
      UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='pco' || user.role==='deo'){
          ContractTemplateModel.findById(req.query.templateId, function(err, result){
            if (err) res.json(err);
            res.json([{status:1,message:'Access Granted',result:result}]);
          });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    }) 
}
