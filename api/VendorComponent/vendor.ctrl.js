const VendorModel = model('vendor');
const FinancialBiddingsModel = model('financialbidding');
const UserModel = model('user');
const TenderMeds = model('tendermeds');
var mongoose = require('mongoose');

exports.allvendors = function(req,res,next){
    // next(); IF ERROR OCCURS
    //res.send("Get all vendors");
    // UserModel.find().
    //     where('_id').equals(req.params.userId).
    //     exec(function(err, users){
    //         if(err){
    //             res.send(err);
    //         }
    //         res.json(users);
    // });
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin' || user.role==='user' || user.role==='pco'){
            VendorModel.find({is_active:true},function(err, vendors){
                if (err){
                    res.json(err);
                } 
                res.json([{status:1,message:'Access Granted',vendors:vendors}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',vendors:[]}]);
        }
    });
}
exports.getSingleVendor = function(req,res,next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin' || user.role==='user' || user.role==='pco'){
            VendorModel.findById(req.query.vendorId ,function(err, vendor){
                if (err){
                    res.json(err);
                } 
                res.json([{status:1,message:'Access Granted',vendor:vendor}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',vendor:[]}]);
        }
    });
}
exports.updateActiveStatus = function(req,res,next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin'){
            console.log("DURATION FOR VENDOR:_____", req.query.blisttime)
            VendorModel.update({_id:req.query.vendorId},{$set:{is_active:false, is_qualified:req.query.blisttime}},{ multi: false,upsert: true},function(err, result){
                if (err){
                    res.json(err);
                } 
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    });
}

exports.qualifiedvendors = function(req,res,next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='pco'){
            VendorModel.find({is_qualified: true},function(err, vendors){
                if (err){
                    res.json(err);
                } 
                res.json([{status:1,message:'Access Granted',vendors:vendors}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',vendors:[]}]);
        }
    }) 
}
exports.getFinancialVendors = function(req,res,next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='pco'){

            FinancialBiddingsModel.aggregate([
                // Stage 1
                // Stage 2
                {
                    $match: {
                        tender: mongoose.Types.ObjectId(req.query.tenderId)
                    }
                },
                {
                    $lookup: {
                        "from" : "vendors",
                        "localField" : "vendor",
                        "foreignField" : "_id",
                        "as" : "vendor"
                    }
                }

            ]).exec(function(err, vendors){
                if (err){
                    res.json(err);
                } 

                res.json([{status:1,message:'Access Granted',vendors:vendors}]);
            });

        }
        else {
            res.json([{status:0,message:'Access Denied',vendors:[]}]);
        }
    }); 
}
exports.getTenderMeds = function(req,res,next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='pco'){

            TenderMeds.aggregate([
                    // Stage 1
                    {
                        $match: {
                            // enter query here
                            tender: mongoose.Types.ObjectId(req.query.tenderId)
                        }
                    },

                ]).exec(function(err, meds){
                    if (err){
                        res.json(err);
                    } 

                    res.json([{status:1,message:'Access Granted',meds:meds[0].medicine}]);
                });
        }
        else {
            res.json([{status:0,message:'Access Denied',meds:[]}]);
        }
    }); 
}

exports.addvendor = function(req,res,next){

    var saveVendor = model('vendor'); 
    var newVendor = new saveVendor({
                                    name: req.body.name,
                                    address: req.body.address,
                                    phonenumber: req.body.phonenumber,
                                    city: req.body.city,
                                    email: req.body.email,
                                    website: req.body.website,
                                    dateofestablishment: req.body.dateofestablishment,
                                    focalpersonname: req.body.focalpersonname,
                                    focalpersonnumber: req.body.focalpersonnumber,
                                    businesstype: req.body.businesstype,
                                });
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin'){
            newVendor.save(function(err, result){
                if(err){ res.json(err); }
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    }) 
}