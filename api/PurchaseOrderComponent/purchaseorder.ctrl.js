const UserModel = model('user');
const PurchaseOrderModel = model('purchaseorder');
const DistrictsModel = model('districts');
const DemandsModel = model('demand');
const TenderMedsModel = model('tendermeds');
var mongoose = require('mongoose');

var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');
// var html = fs.readFileSync('./contract-form.html', 'utf8');

exports.allpurchaseorders = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            PurchaseOrderModel.find({user: user._id},function(err, orders) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'All Orders',orders:orders}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',orders:null}]);
        }
    })
}
exports.getTenderPos = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            // PurchaseOrderModel.find({user: user._id},function(err, orders) {
            //     if (err) {
            //         res.send(err);
            //     }
            //     res.json([{status:1,message:'All Orders',orders:orders}]);
            // });
    PurchaseOrderModel.aggregate([
        // Stage 1
        {
            $match: {
                user: mongoose.Types.ObjectId(req.query.userId),
                tender: mongoose.Types.ObjectId(req.query.tenderId)
            
            }
        }
    ]).exec(function(err, pos) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'All Orders',pos:pos}]);
            });

        }
        else{
            res.json([{status:0,message:'Access Denied',pos:null}]);
        }
    })
}

exports.getuserdemands = function (req, res, next) {

    UserModel.findById(req.query.userId, function (err, user) {        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            DemandsModel.find({user: user._id},function(err, demands) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'User demands',demands:demands}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',demands:null}]);
        }
    })
}
exports.getuserzone = function (req, res, next) {

    UserModel.findById(req.query.userId, function (err, user) {        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            DistrictsModel.findOne({_id: user.district[0]._id},function(err, zone) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'User zone',zone:zone}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',zone:null}]);
        }
    })
}
exports.getclosedtendermeds = function (req, res, next) {

    UserModel.findById(req.query.userId, function (err, user) {        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            TenderMedsModel.findOne({tender: req.query.tenderId},function(err, tendermeds) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'Tender meds',tendermeds:tendermeds}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',tendermeds:null}]);
        }
    })
}
exports.addpurchaseorder = function (req, res, next) {

    
    UserModel.findById(req.body.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            var saveOrder = model('purchaseorder');
            var options = { 
                format: 'Letter',
                "border": {
                  "top": "0.7in",            // default is 0, units: mm, cm, in, px 
                  "right": "0.7in",
                  "bottom": "0.4in",
                  "left": "0.7in"
                },
               
                // "header": {
                //   "height": "45mm",
                //   "contents": '<div style="text-align: center;">Pitb - eprocurement</div>'
                // },
                "type": "pdf",             // allowed file types: png, jpeg, pdf 

                "footer": {
                  "height": "3mm",
                  "contents": {
                    // first: 'Cover page',
                    // 2: 'Second page', // Any page number is working. 1-based index
                    default: '<div style="text-align: right;font-size:8px;">'+req.body.userName+'</div>' // fallback value
                  }
                }
            };
            var saveOrder = new saveOrder({
                                    ponumber: req.body.ponumber,
                                    leadtime: req.body.leadtime,
                                    createdat: req.body.createdat,
                                    tendername: req.body.tendername,
                                    vendorname: req.body.vendorname,
                                    tender: req.body.tender,
                                    vendor: req.body.vendor,
                                    user: user._id,
                                    medicine: req.body.medicine
                                });
            saveOrder.save(function(err, order) {
                if (err) {
                    res.send(err);
                }
                TenderMedsModel.findOne({tender: order.tender}, function(err, tendermed){
                    if (err) {
                        res.send(err)
                    }
                    order.medicine.forEach(function(val,j){
                        tendermed.medicine.forEach(function(val2,i){
                            if(val._id.toString()==val2._id.toString()) {
                                tendermed.medicine[i].quantity = order.medicine[j].quantity
                                console.log("Quantities")
                            }    
                        })
                    })
                    console.log("Tender med",tendermed)
                    TenderMedsModel.findByIdAndUpdate(tendermed._id, { $set: { medicine: tendermed.medicine } },
                        function (err, updatedtendermed) {
                            if (err) return res.send(err);
                            console.log("Updateddd",updatedtendermed)
                    });
                    // console.log("Tender med",tendermed)
                    // console.log("Order",order)
                })
                pdf.create(req.body.poHTML, options)
                    .toFile('./purchaseorders/'+order._id+'.pdf', 
                        function(err, res) {
                          if (err) return console.log(err);
                            console.log(res); // { filename: '/app/businesscard.pdf' } 
                });
                res.json([{status:1,message:'Access Granted',order: order}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',order: null}]);
        }
    })
}
