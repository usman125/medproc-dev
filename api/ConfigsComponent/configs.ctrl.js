const ConfigsModel = model('configs');
const UserModel = model('user');

const DistrictsModel = model('districts');
const MediTypeModel = model('meditype');
const MediMesUnitModel = model('mediunitmeasure');
const MediUnitModel = model('mediunit');
const DepartmentsModel = model('departments');
const TehsilsModel = model('tehsils');
const ZonesModel = model('zones');

var mongoose = require('mongoose');

exports.allConfigs = function(req, res, next){
    // res.send("all Configs response");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='pco' || user.role==='user'){
          ConfigsModel.find(function(err, configs){
            if(err){
                res.json(err)    
            }
            res.json([{status:1,message:'Access Granted',configs:configs}]); 
        });
        }
        else {
          res.json([{status:0,message:'Access Denied',configs:[]}]);
        }
    }) 
}
// Zones
exports.allZones = function(req, res, next){
    // console.log(req.body.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         department: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            ZonesModel.find(function(err, zones){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',zones:zones}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',zones:null}]);
        }
    });
}
// District Configs
exports.addDistrict = function(req, res, next){
    // console.log(req.body.newDep);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         department: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            var newDistrict = new DistrictsModel({name:req.body.name,
                                                  zone:req.body.zone});
            newDistrict.save(function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    });
}
exports.allDistrict = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'|| user.role==='user'){
            DistrictsModel.find(function(err, districts){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',districts:districts}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',districts:null}]);
        }
    });
}
exports.userDistrict = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='user'){
            res.json([{status:1,message:'Access Granted',districts: user.district}]);
        }
        else {
          res.json([{status:0,message:'Access Denied',districts: null}]);
        }
    });
}

// department configs
exports.editDepartment = function(req, res, next){
    var name = req.body.name;
    var itemId = req.body.itemId;
    var configId = req.body.configId;
    console.log(name, itemId, configId);
    UserModel.findById(req.body.userId, function (err, user) {
        if(err) {
            res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({
            //     _id:req.body.configId, 
            //     'department._id':req.body.itemId
            //     },{$set:{'department.$.name':name}}, function (err, user) {
            DepartmentsModel.update({
                _id:itemId
                },{$set:{'name':name}}, 
                function(err, result){    
                    if (err){
                        res.json(err);
                    }    
                    res.json([{status:1,message:'Access Granted',result:result}]); 
                });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    }) 
}

exports.addDepartment = function(req, res, next){
    console.log(req.body.newDep);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         department: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            var newDep = new DepartmentsModel({name:req.body.name});
            newDep.save(function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}
exports.allDepartments = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin' || user.role==='pco'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         department: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            DepartmentsModel.find(function(err, departments){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',departments:departments}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',departments:null}]);
        }
    });
}
// Tehsils Configs
exports.allTehsils = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         department: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            TehsilsModel.find(function(err, tehsils){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',tehsils:tehsils}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',tehsils:null}]);
        }
    });
}
exports.editTehsil = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({
                    _id:req.body.configId, 
                    'tehsil._id':req.body.itemId
                },{$set:{'tehsil.$.name':req.body.name}}, function (err, user) {
                if (err){
                    res.json(err);
                }    
                res.json([{status:1,message:'Access Granted',user:user}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}

exports.addTehsil = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         tehsil: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.send(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            var newTehsil = new TehsilsModel({name:req.body.name,
                                                  district:req.body.district});
            newTehsil.save(function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}
exports.getTehsilsByDistrict = function(req, res, next){

    console.log(req.query.userId);
    console.log(req.query.district);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            TehsilsModel.aggregate(
                // Pipeline
                [
                    // Stage 1
                    {
                        $match: {
                            district:req.query.district
                        }
                    }

                ]
            ).exec(function(err, tehsils){
                if(err) res.send(err);
                res.json([{status:1,message:'Access Granted',tehsils:tehsils}]);
            });

        }
        else {
          res.json([{status:0,message:'Access Denied',tehsils:null}]);
        }
    });
}
// Facility Type configs
exports.editFacilityType = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({
            _id:req.body.configId, 
            'facilitytype._id':req.body.itemId
                },{$set:{'facilitytype.$.name':req.body.name}}, function (err, user) {
                if (err){
                    res.json(err);
                }    
                res.json([{status:1,message:'Access Granted',user:user}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}

exports.addFacilityType = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({ 
                $push: { 
                    facilitytype: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
                } 
            }, function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}

// Medicine Type configs
exports.allMediType = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            MediTypeModel.find(function(err, meditypes){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',meditypes:meditypes}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',meditypes:null}]);
        }
    });
}
exports.editMediType = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({
            //         _id:req.body.configId, 
            //         'meditype._id':req.body.itemId
            //     },{$set:{'meditype.$.name':req.body.name}}, function (err, user) {
            //     if (err){
            //         res.json(err);
            //     }    
            //     res.json([{status:1,message:'Access Granted',user:user}]);
            // });
            MediTypeModel.update({
                _id:req.body.itemId
                },{$set:{'name':req.body.name}}, 
                function(err, result){    
                    if (err){
                        res.json(err);
                    }    
                    res.json([{status:1,message:'Access Granted',result:result}]); 
                });            
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}

exports.addMediType = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         meditype: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.json(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            var mediType = new MediTypeModel({name:req.body.name});
            mediType.save(function(err, result){
                if(err){
                    res.send(err);
                }
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}
// Medicine Unit configs
exports.allMediUnit = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            MediUnitModel.find(function(err, mediunit){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',mediunit:mediunit}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',mediunit:null}]);
        }
    });
}
exports.editMediUnit = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({
                    _id:req.body.configId, 
                    'mediunit._id':req.body.itemId
                },{$set:{'mediunit.$.name':req.body.name}}, function (err, user) {
                if (err){
                    res.json(err);
                }    
                res.json([{status:1,message:'Access Granted',user:user}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}

exports.addMediUnit = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            // ConfigsModel.update({ 
            //     $push: { 
            //         mediunit: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
            //     } 
            // }, function(err, result){
            //     if(err){
            //         res.json(err)    
            //     } 
            //     res.json([{status:1,message:'Access Granted',result:result}]);
            // });
            var mediUnit = new MediUnitModel({name:req.body.name});
            mediUnit.save(function(err, result){
                if(err){
                    res.send(err);
                }
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}
// Facilities configs
exports.editFacility = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({
                _id:req.body.configId, 
                'facilities._id':req.body.itemId
            },{$set:{'facilities.$.name':req.body.name}}, function (err, user) {
                if (err){
                    res.json(err);
                }    
                res.json([{status:1,message:'Access Granted',user:user}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}

exports.addFacility = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({ 
                $push: { 
                    facilities: {name: req.body.name, _id: new mongoose.Types.ObjectId} 
                } 
            }, function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}
// Medicine Meaurement Unit configs
exports.allMediMesUnit = function(req, res, next){
    // console.log(req.query.newDep);
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            MediMesUnitModel.find(function(err, medimesunit){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',medimesunit:medimesunit}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',medimesunit:null}]);
        }
    });
}
exports.editMediMesUnit = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            ConfigsModel.update({
                    _id:req.body.configId, 
                    'mediunitmeasure._id':req.body.itemId
                },{$set:{'mediunitmeasure.$.name':req.body.name}}, function (err, user) {
                if (err){
                    res.json(err);
                }    
                res.json([{status:1,message:'Access Granted',user:user}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',user:null}]);
        }
    })
}
exports.addMediMesUnit = function(req, res, next){
    console.log(req.body.name);
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
          res.json(err);
        }
        if(user.role==='admin'){
            var mediMedUnit = new MediMesUnitModel({name:req.body.name});
            mediMedUnit.save(function(err, result){
                if(err){
                    res.send(err)    
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
          res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}

