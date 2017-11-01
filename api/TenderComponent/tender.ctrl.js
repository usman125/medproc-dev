const TenderModel = model('tender');
const UserModel = model('user');
var mongoose = require('mongoose');

exports.locktender = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='user' || user.role==='pco'){
            TenderModel.findById(req.query.tenderId, function(err, tender) {
                if (err){
                    res.json(err);
                } else {
                    tender.islocked = "1"
                    tender.save((err,tender) => {
                        if (err) res.send(err)
                    });
                    res.json([{status:1,message:'tender Updated',tender: tender}]);
                }
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',tender:null}]);
        }
    })
}
exports.closeTender = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='user' || user.role==='pco'){
            TenderModel.findById(req.query.tenderId, function(err, tender) {
                if (err){
                    res.json(err);
                } else {
                    tender.isclosed = "1"
                    tender.save((err,tender) => {
                        if (err) res.send(err)
                    });
                    res.json([{status:1,message:'tender Updated',tender: tender}]);
                }
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',tender:null}]);
        }
    })
}
exports.allclosedtenders = function(req,res,next){
  // next(); IF ERROR OCCURS
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
        res.json(err);
    }
    if(user.role==='user'){
      TenderModel.find({"isclosed":1},function(err, tenders){
          if (err){
              res.json(err);
          } 
          res.json([{status:1,message:'Access Granted',tenders:tenders}]);
      });
      

      }else{
          res.json([{status:0,message:'Access Denied',tenders:[]}]);
      }
    });
}
exports.alltenders = function(req,res,next){
  // next(); IF ERROR OCCURS
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
        res.json(err);
    }
    if(user.role==='admin' || user.role==='user' || user.role==='pco'){
      // TenderModel.find(function(err, tenders){
      //     if (err){
      //         res.json(err);
      //     } 
      //     res.json([{status:1,message:'Access Granted',tenders:tenders}]);
      // });
      TenderModel.aggregate([
          // Stage 1
          {
              $lookup: {
                  "from" : "prequaliprofiles",
                  "localField" : "prequaliprofile",
                  "foreignField" : "_id",
                  "as" : "prequaliprofile"
              }
          },
          // Stage 2
          {
              $lookup: {
                  "from" : "techqualiprofiles",
                  "localField" : "techqualiprofile",
                  "foreignField" : "_id",
                  "as" : "techqualiprofile"
              }
          }

      ]).exec(function(err, tenders){
          if (err){
                  res.json(err);
              } 
              res.json([{status:1,message:'Access Granted',tenders:tenders}]);
          });

      }else{
          res.json([{status:0,message:'Access Denied',tenders:[]}]);
      }
    });
}
exports.allPreQualifyTenders = function(req,res,next){
    // next(); IF ERROR OCCURS
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin' || user.role==='user' || user.role==='pco'){
            TenderModel.aggregate([

                // Pipeline
                // Stage 1
                {
                    $match: {
                        "prequalification": "prequalify",
                        "islocked": "1"
                    }
                }

            ]).exec(function(err, tenders){
                if(err) res.send(err);
                res.json([{status:1,message:'Access Granted',tenders:tenders}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',tenders:[]}]);
        }
    }) 
}

exports.tendersbydepartment = function(req,res,next){
    // next(); IF ERROR OCCURS
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin' || user.role==='user' || user.role==='pco'){
            TenderModel.find({
                department: {
                    _id: user.department[0]._id, 
                    name: user.department[0].name }
                }, function(err, tenders){
                if (err){
                    res.json(err);
                } 
                res.json([{status:1,message:'Access Granted',tenders:tenders}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',tenders:[]}]);
        }
    }) 
}
exports.addtender = function(req,res,next){
    var saveTender = model('tender'); 
    var departments = req.body.department
    var newDepartment = [];
    console.log(departments);
    for (let i=0; i<departments.length; i++){
        var newDoc = {_id: departments[i]._id, 
                      name: departments[i].itemName}

        newDepartment.push(newDoc); 
    }
    console.log(newDepartment);
    var newTender = new saveTender({name: req.body.name,
                                    fiscalyear: req.body.fiscalyear,
                                    tenderdate: req.body.tenderdate,
                                    demanddateto: req.body.demanddateto,
                                    demanddatefrom: req.body.demanddatefrom,
                                    advdate: req.body.advdate,
                                    department: req.body.department,
                                    pubinnews: req.body.pubinnews,
                                    filefornews: req.body.filefornews,
                                    pubinppra: req.body.pubinppra,
                                    filefortender: req.body.filefortender,
                                    techqualiprofile: mongoose.Types.ObjectId(req.body.techqualiprofile),
                                    prequaliprofile: mongoose.Types.ObjectId(req.body.prequaliprofile),
                                    emergancy: req.body.emergancy,
                                    prequalification: req.body.prequalification,
                                });
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin'){
            newTender.save(function(err, tender){
                if(err){ 
                    res.json(err); 
                }
                res.json([{status:1,message:'Access Granted',tender:tender}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',tender:null}]);
        }
    })
}
exports.editTender = function(req, res, next){
    UserModel.findById(req.query.userId, function (err, user) {
      if (err) {
          res.json(err);
      }
      if(user.role==='admin' || user.role==='user' || user.role==='pco'){
          TenderModel.findById(req.query.tenderId, function(err, tender){
              if (err){
                  res.json(err);
              } 
              res.json([{status:1,message:'Access Granted',tender:tender}]);
          });
      }
      else {
          res.json([{status:0,message:'Access Denied',tender:[]}]);
      }
    })
}
exports.updateTender = function(req, res, next){
    UserModel.findById(req.query.userId, function (err, user) {
      if (err) {
          res.json(err);
      }
      if(user.role==='admin' || user.role==='user' || user.role==='pco'){
          TenderModel.findByIdAndUpdate(req.query.tenderId, {
                $set: {
                    "name": req.query.tenderName
                }
            }, { multi: false,upsert: false}, function(err, tender){
              if (err){
                  res.json(err);
              } 
              res.json([{status:1,message:'Access Granted',tender:tender}]);
          });
          
      }
      else {
          res.json([{status:0,message:'Access Denied',tender:[]}]);
      }
    })

}

exports.getTender = function(req, res, next){
    UserModel.findById(req.query.userId, function (err, user) {
      if (err) {
          res.json(err);
      }
      if(user.role==='admin' || user.role==='user' || user.role==='pco'){
          TenderModel.find({
              _id: req.query.tenderId
              }, function(err, tender){
              if (err){
                  res.json(err);
              } 
              res.json([{status:1,message:'Access Granted',tender:tender}]);
          });
      }
      else {
          res.json([{status:0,message:'Access Denied',tender:[]}]);
      }
    }) 
}
exports.getQualiProfiles = function(req, res, next){
    console.log(req.query.tenderId)
    var id = req.query.tenderId;
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin' || user.role==='pco'){
            TenderModel.aggregate([

                // Pipeline
                // Stage 1
                {
                    $match: {
                        "_id": mongoose.Types.ObjectId(id)
                    }
                },
                // Stage 2
                {
                    $lookup: {
                        "from" : "prequaliprofiles",
                        "localField" : "prequaliprofile",
                        "foreignField" : "_id",
                        "as" : "prequaliprofile"
                    }
                },
                // Stage 3
                {
                    $lookup: {
                        "from" : "techqualiprofiles",
                        "localField" : "techqualiprofile",
                        "foreignField" : "_id",
                        "as" : "techqualiprofile"
                    }
                }

            ]).exec(function(err, result){
                if(err) res.send(err);
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',result:null}]);
        }
    });
}