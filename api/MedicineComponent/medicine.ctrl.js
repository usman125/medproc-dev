const MedicineModel = model('medicine');
const UserModel = model('user')

exports.allmedicines = function(req, res, next) {
	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='admin' || user.role==='pco' || user.role==='user'){
			// MedicineModel.find(function(err, medicines) {
			// 	if (err) {
			// 		res.json([{status:0,message:'Error',error:err}]);
			// 	}
			// 	res.json([{status:1,message:'Access Granted',medicines:medicines}]);
			// });
			MedicineModel.aggregate([
					// Stage 1
					{
						$lookup: {
						    "from" : "departments",
						    "localField" : "department",
						    "foreignField" : "_id",
						    "as" : "department"
						}
					}

				]).exec(function(err, medicines) {
					if (err) {
						res.json([{status:0,message:'Error',error:err}]);
					}
					res.json([{status:1,message:'Access Granted',medicines:medicines}]);
				});
		}
		else {
			res.json([{status:0,message:'Access Denied',medicines:[]}]);
		}
	})
}
exports.medicinesbydepartment = function(req, res, next) {
	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='admin' || user.role==='pco' || user.role==='user'){
			MedicineModel.find(
				{ department: user.department[0]._id }
				,function(err, medicines) {
				if (err) {
					res.json([{status:0,message:'Error',error:err}]);
				}
				res.json([{status:1,message:'Access Granted',medicines:medicines}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',medicines:[]}]);
		}
	})
}
exports.addmedicine = function (req, res, next) {
	var saveMedicine = model('medicine');
	var newMedicine = new saveMedicine({
										name: req.body.name,
										mediunit: req.body.mediunit,
										medisize: req.body.medisize,
										meditype: req.body.meditype,
										dosage: req.body.dosage,
										sgtdquantity: req.body.sgtdquantity,
										medigenre: req.body.medigenre,
										estprice: req.body.estprice,
										chemicalname: req.body.chemicalname,
										filereference: req.body.filereference,
										department: req.body.department
									});
	UserModel.findById(req.body.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='admin'){
			newMedicine.save(function(err, medicine) {
				if (err) {
					res.send([{status:0,message:'Error',error:err}]);
				}
				res.json([{status:1,message:'Access Granted',medicine:medicine}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',medicine:null}]);
		}
	})
}