const VendorContractModel = model('vendorcontract');
const UserModel = model('user');
var mongoose = require('mongoose');
var fs = require('fs');
var pdf = require('html-pdf');
var path = require('path');
// var html = fs.readFileSync('./contract-form.html', 'utf8');
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
    "type": "pdf"             // allowed file types: png, jpeg, pdf 

    // "footer": {
    //   "height": "15mm",
    //   "contents": {
    //     // first: 'Cover page',
    //     // 2: 'Second page', // Any page number is working. 1-based index
    //     default: '<div style="text-align: center;">{{page}}/{{pages}}</div>', // fallback value
    //     last: '<div style="text-align: center;">Last Page</div>'
    //   }
    // }
  };
exports.addVendorContract = function(req, res, next){
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
      var newContract = new VendorContractModel({
        tenderId: req.body.tenderId,
        vendorId: req.body.vendorId,
        contractprofileId: req.body.contractprofileId,
        contractprofiletext: req.body.contractprofiletext,
        contractdate: req.body.contractdate
      });

          pdf.create(req.body.contractprofiletext, options)
             .toFile('./vendorcontracts/'+req.body.vendorId+req.body.tenderId+'.pdf', 
            function(err, res) {
              if (err) return console.log(err);
              console.log(res); // { filename: '/app/businesscard.pdf' } 
          });
      console.log("vendorname: ",req.body.vendorname);
      newContract.save(function(err, result){
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
exports.allVendorContracts = function(req, res, next){
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      VendorContractModel.find(function(err, contracts){
        if(err) {
          res.json(err)
        }
        res.json([{status:1,message:'Access Granted',contracts:contracts}]);
      });
    }
    else {
      res.json([{status:0,message:'Access Denied',contracts:[]}]);
    }
  });
}
exports.getTenderContracts = function(req, res, next){
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      // VendorContractModel.find(function(err, contracts){
      //   if(err) {
      //     res.json(err)
      //   }
      //   res.json([{status:1,message:'Access Granted',contracts:contracts}]);
      // });
      VendorContractModel.aggregate([
          // Stage 1
          {
            $match: {
              tenderId: mongoose.Types.ObjectId(req.query.tenderId)
            }
          },

          // Stage 2
          {
            $count: "totalcontracts"
          }

        ]).exec(function(err, totalcontracts){
          if(err) {
            res.json(err)
          }
          res.json([{status:1,message:'Access Granted',totalcontracts:totalcontracts[0]}]);
        });

    }
    else {
      res.json([{status:0,message:'Access Denied',totalcontracts:[]}]);
    }
  });
}

exports.getContractFile = function(req, res, next){
  UserModel.findById(req.query.userId, function (err, user) {
    if (err) {
      res.json(err);
    }
    if(user.role==='pco' || user.role==='deo' || user.role==='admin'){
      // VendorContractModel.find(function(err, contracts){
      //   if(err) {
      //     res.json(err)
      //   }
        // res.json([{status:1,message:'Access Granted',contracts:null}]);
      // });
      // var file = './vendorcontracts/'+req.query.vendorId+req.query.tenderId+'.pdf';
      // // var file = './vendorcontracts/'+req.query.vendorId+req.query.tenderId+'.pdf';
      // console.log("file from get contract file: ", file);
      // res.download(file);
      // res.send(file);
    }
    else {
      res.json([{status:0,message:'Access Denied',contracts:[]}]);
    }
  });
}

