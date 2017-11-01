const UserModel = model('user');
const PurchaseOrderModel = model('purchaseorder');

exports.updategoodsrecieved = function (req, res, next) {
    UserModel.findById(req.body.userId, function (err, user) {
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            PurchaseOrderModel.findByIdAndUpdate(req.body.goods._id,
            { $set: { 
                medicine: req.body.goods.medicine, 
                fileref: req.body.goods.fileref, 
                isverified: req.body.goods.isverified 
            } }, function (err, updatedorder) {
              if (err) return res.send(err);
              res.json([{status:1,message:'Order Updated',goods: updatedorder}])
            });
        } else {
            res.json([{status:0,message:'Access Denied',goods: []}])
        }
    })
}
exports.raiselateissuance = function (req, res, next) {
    UserModel.findById(req.body.userId, function (err, user) {
        if (err){
            res.json(err);
        }
        if(user.role==='user'){
            PurchaseOrderModel.findByIdAndUpdate(req.body.orderId, { $set: { islate: true } },
             function (err, updatedorder) {
              if (err) return res.send(err);
              res.json([{status:1,message:'Order Updated',goods: updatedorder}])
            });
        } else {
            res.json([{status:0,message:'Access Denied',goods: []}])
        }
    })
}
