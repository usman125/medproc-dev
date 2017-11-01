const VendorTechQualiModel = model('vendortechquali');
const UserModel = model('user');
const VendorModel = model('vendor');
const TenderMedsModel = model('tendermeds');
const FinancialBiddingModel = model('financialbidding');
var mongoose = require('mongoose');

exports.alltendormeds = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            TenderMedsModel.find(function(err, bids) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'All Bids',bids:bids}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',bids:null}]);
        }
    })
}
exports.singleTenderMeds = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            TenderMedsModel.aggregate([
                    // Stage 1
                    {
                        $match: {
                            // enter query here
                            tender: mongoose.Types.ObjectId(req.query.tenderId)
                        }
                    }

                ]).exec(function(err, bids) {
                    if (err) {
                        res.send(err);
                    }
                    res.json([{status:1,message:'All Bids',bids:bids[0]}]);
                });

        }
        else{
            res.json([{status:0,message:'Access Denied',bids:null}]);
        }
    })
}

exports.allfinancialbids = function (req, res, next) {

    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            FinancialBiddingModel.find(function(err, bids) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'All Bids',bids:bids}]);
            });
        }
        else{
            res.json([{status:0,message:'Access Denied',bid:null}]);
        }
    })
}
exports.tenderfinancialbids = function (req, res, next) {
    
    UserModel.findById(req.query.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            // FinancialBiddingModel.find(function(err, bids) {
            //     if (err) {
            //         res.send(err);
            //     }
            //     res.json([{status:1,message:'All Bids',bids:bids}]);
            // });
            FinancialBiddingModel.aggregate([
                    // Stage 1
                    {
                        $match: {
                            // enter query here
                            tender: mongoose.Types.ObjectId(req.query.tenderId)
                        }
                    },

                    // Stage 2
                    {
                        $count: "totalfinancials"
                    }

                ]).exec(function(err, totalfinancials) {
                    if (err) {
                        res.send(err);
                    }
                    res.json([{status:1,message:'All Bids',totalfinancials:totalfinancials[0]}]);
                });
        }
        else{
            res.json([{status:0,message:'Access Denied',totalfinancials:null}]);
        }
    })
}
function compareBidValues (oldbid, bid, i) {

    if ( (parseFloat(bid.medicine[i].northbid) > parseFloat(0))
     && ( (parseFloat(oldbid.northbid) === parseFloat(0)) 
      || (parseFloat(bid.medicine[i].northbid)
       < parseFloat(oldbid.northbid) ) ) ) 
    {        
        oldbid.northbid = bid.medicine[i].northbid
        oldbid.northvendor = bid.vendor
        oldbid.northvendorname = bid.vendorname
    }
    if ( (parseFloat(bid.medicine[i].southbid) > parseFloat(0))
     && ( (parseFloat(oldbid.southbid) === parseFloat(0)) 
      || (parseFloat(bid.medicine[i].southbid)
       < parseFloat(oldbid.southbid) ) ) ) 
    {     
        oldbid.southbid = bid.medicine[i].southbid
        oldbid.southvendor = bid.vendor
        oldbid.southvendorname = bid.vendorname
    }
    if ( (parseFloat(bid.medicine[i].centralbid) > parseFloat(0))
     && ( (parseFloat(oldbid.centralbid) === parseFloat(0)) 
      || (parseFloat(bid.medicine[i].centralbid)
       < parseFloat(oldbid.centralbid) ) ) ) 
    {        
        oldbid.centralbid = bid.medicine[i].centralbid
        oldbid.centralvendor = bid.vendor
        oldbid.centralvendorname = bid.vendorname
    }
    return oldbid
}
function calcBids (tenderbid, bid) {

    tenderbid.medicine.forEach(function(oldbid,i) {

        oldbid = compareBidValues(oldbid, bid, i)
    })
    return tenderbid
}
function updateBid (res, tenderbid, bid) {
    JSON.stringify(tenderbid)
                        
    tenderbid = calcBids(tenderbid, bid)

    TenderMedsModel.findByIdAndUpdate(tenderbid._id, 
    { $set: { medicine: tenderbid.medicine } }, function(err, result){
        if (err){
            res.send(err)
        }
        res.json([{status: 1,message: 'Bid Updated',bid: result}]);
    })
}
function setZoneWiseVendors(val, bid) {
    if (parseFloat(val.northbid) > parseFloat(0)) {
        val.northvendor = bid.vendor
        val.northvendorname = bid.vendorname
    }
    if (parseFloat(val.southbid) > parseFloat(0)) {
        val.southvendor = bid.vendor
        val.southvendorname = bid.vendorname
    }
    if (parseFloat(val.centralbid) > parseFloat(0)) {
        val.centralvendor = bid.vendor
        val.centralvendorname = bid.vendorname
    }
    return val
}

function saveNewTenderBid (res, bid) {
    var saveTenderBid = model('tendermeds')
    JSON.stringify(bid)
    
    bid.medicine.forEach(function(val) {

        val = setZoneWiseVendors(val, bid)
    })
    var saveTenderBid = new saveTenderBid({
        tender: bid.tender,
        tendername: bid.tendername,
        medicine: bid.medicine
    })
    saveTenderBid.save(function(err, result){
        if (err){
            res.send(err)
        }
        res.json([{status: 1,message: 'Bid Created',bid: result}]);
    })
}
exports.addfinancialbid = function (req, res, next) {
    
    UserModel.findById(req.body.userId, function (err, user) {
        
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            var saveBid = model('financialbidding');
            var saveBid = new saveBid({
                                    tendername: req.body.tendername,
                                    vendorname: req.body.vendorname,
                                    tender: req.body.tender,
                                    vendor: req.body.vendor,
                                    medicine: req.body.medicine
                                });
            saveBid.save(function(err, bid) {
                if (err) {
                    res.send(err);
                }
                TenderMedsModel.findOne({tender: bid.tender}, function(err,tenderbid){
                    if (err){
                        res.send(err)
                    }
                    if (tenderbid!==null){

                        updateBid(res, tenderbid, bid)
                    } else {

                        saveNewTenderBid(res, bid)
                    }
                })
            });
        }
        else{
            res.json([{status: 0,message: 'Access Denied',bid: null}]);
        }
    })
}
exports.getqualifiedvendors = function (req, res, next) {
    UserModel.findById(req.query.userId, function (err, user) {
        if (err){
            res.json(err);
        }
        if(user.role==='pco'){
            VendorTechQualiModel.find(function(err, tech) {
                if (err) {
                    res.send(err);
                }
                res.json([{status:1,message:'All VendorTechQuali',result: tech}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',result:null}]);
        }
    })
}