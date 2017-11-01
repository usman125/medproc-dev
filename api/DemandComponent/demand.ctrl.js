const DemandModel = model('demand');
const UserModel = model('user');
const DistrictModel = model('districts');
const DemandHistoryModel = model('demandhistory');
var mongoose = require('mongoose');

exports.dddemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		console.log("Dep",user.department)
		if(user.role==='pco'){
			DemandModel.find(
				{
					department: req.query.departmentId,
					tenderref: req.query.tenderId,
					district: req.query.districtId
				}
				,function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.allDashboardDemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		console.log("Dep",user.department)
		if(user.role==='pco' || user.role==='user'){
		// 	DemandModel.distinct("tenderref"
		// 		,function(err, demands) {
		// 		if (err) {
		// 			res.json(err);
		// 		}
		// 		res.json([{status:1,message:'Access Granted',demands: demands}]);
		// 	});
			DemandModel.aggregate([
        // Stage 1
        // {
        //   $match: {
          
        //      status: "pending"

        //   }
        // },
         // Stage 2
        {
          $group: {
          
             _id: null, distinct: {$addToSet: "$tenderref"} 
          
          }
        },

				// Stage 2
				
        // Stage 3
        {
          $lookup: {
              "from" : "tenders",
              "localField" : "distinct",
              "foreignField" : "_id",
              "as" : "tenders"
          }
        }
            
      ]).exec(function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.allUserDashboardDemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		console.log("Dep",user.department)
		if(user.role==='pco' || user.role==='user'){
				DemandModel.aggregate([
				// Stage 1
				{
					$match: {
						user : mongoose.Types.ObjectId(req.query.userId)
					}
				},

				// Stage 2
				{
					$unwind: {
					    path : "$tenderref"
					}
				},

				// Stage 3
				{
					$group: {
						_id: null, distinct: {$addToSet: "$tenderref"} 
					}
				},

				// Stage 4
				{
					$lookup: {
					    "from" : "tenders",
              "localField" : "distinct",
              "foreignField" : "_id",
              "as" : "tenders"
					}
				}
            
      ]).exec(function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}

exports.departmentdemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		console.log("Dep",req.body.departmentId)
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find(
				{
					department: req.query.departmentId,
					tenderref: req.query.tenderId
				}
				,function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.tenderdemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.aggregate([
				// Stage 1
				{
					$match: {
						tenderref: mongoose.Types.ObjectId(req.query.tenderId)
					}
				}
				// ,

				// // Stage 2
				// {
				// 	$limit:  // positive integer
				// 	 8
				// }

			]).exec(function(err, demands){
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});

			// DemandModel.find(
			// 	{
			// 		tenderref: req.query.tenderId
			// 	}, 
			// 	function(err, demands) {
			// 		if (err) {
			// 			res.json(err);
			// 		}
			// 		res.json([{status:1,message:'Access Granted',demands: demands}]);
			// });
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.userTenderDemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find(
				{
					tenderref: req.query.tenderId,
					user: req.query.userId
				}
				,function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.userFullDemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find(
				{
					tenderref: req.query.tenderId,
					user: req.query.userId
				}
				,function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}

exports.demandhistory = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='pco'){
			DemandHistoryModel.find({demand: req.query.demandId}, function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.alldemandsbytenderwithstatus = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='pco'){
			DemandModel.find({tenderref: req.query.tenderId, demandstatus: "1"},
			 function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.alldemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco' || user.role==='admin'){
			DemandModel.find(function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.userdemands = function (req, res, next) {

	UserModel.findById(req.query.userId, function (err, user) {
		if (err) {
			res.json(err);
		}
		if(user.role==='user'){
			DemandModel.find({user: req.query.userId},function(err, demands) {
				if (err) {
					res.json(err);
				}
				res.json([{status:1,message:'Access Granted',demands: demands}]);
			});
		}
		else {
			res.json([{status:0,message:'Access Denied',demands: []}]);
		}
	})
}
exports.demand = function (req, res, next) {
	UserModel.findById(req.query.userId, function (err, user) {
		if (err){
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco' || user.role==='admin'){
			// DemandModel.findById(req.query.demandId, function (err, demand) {
			//   	if (err) {
			// 		res.json(err);
			// 	}
			// 	res.json([{status:1,message:'Access Granted',demand:demand}]);
			// });
			DemandModel.aggregate([
					// Stage 1
					{
						$match: {
						_id:mongoose.Types.ObjectId(req.query.demandId)
						}
					},

					// Stage 2
					{
						$lookup: {
						    "from" : "users",
						    "localField" : "user",
						    "foreignField" : "_id",
						    "as" : "user"
						}
					},

				]).exec(function (err, demand) {
			  	if (err) {
						res.json(err);
					}
					res.json([{status:1,message:'Access Granted',demand:demand[0]}]);
				});
		}
		else {
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.adddemand = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		if(user.role==='user'){
			DistrictModel.findById(user.district[0]._id, function(err,district) {
				var saveDemand = model('demand');
				var medicines = req.body.medicine
				var estprice = 0
				medicines.forEach(function (value, i) {
					estprice = estprice + parseInt(medicines[i].estprice)  
				});
				var newDemand = new saveDemand({
									year: req.body.year,
									district: user.district[0]._id,
									districtname: user.district[0].name,
									districtzone: district.zone,
									department: user.department[0]._id,
									departmentname: user.department[0].name,
									demandstatus: 'pending',
									user: req.body.userId,
									tenderref: req.body.tenderref,
									tendername: req.body.tendername,
									demandestprice: estprice,
									medicine: req.body.medicine
								});
					newDemand.save(function(err, demand) {
						if (err) {
							res.send(err);
						}
						res.json([{status:1,message:'Demand Created',demand:demand}]);
					});
			})	
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.editdemand = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		console.log("Med->",req.body.medicine,req.body.demandId)
		if(user.role==='pco'){
			DemandModel.findById(req.body.demandId, function(err, demand) {
				if (err){
					res.json(err);
				} else {
					var medicines = req.body.medicine
					medicines.forEach(function (value, i) {
					    console.log('%d: %s', i, value.newreason, value.newquantity);
					    if (value.newquantity && value.newreason) {
						    medicines[i].quantity = demand.medicine[i].quantity;
						    medicines[i].reason = demand.medicine[i].reason;
						    demand.medicine[i].quantity = value.newquantity;
						    demand.medicine[i].reason = value.newreason;
						}
					});
					var saveDemandHistory = model('demandhistory');
					var newDemandHistory = new saveDemandHistory({
											user: user._id,
											demand: demand._id,
											medicine: medicines
										});

					console.log("Demand After saving->",demand,"BODY",req.body.medicine)
					demand.save((err, newdemand) => {
						if (err) res.send(err)
						newDemandHistory.save((err, demand) => {
							if (err) res.send(err)
							res.json([{status:1,message:'Demand Updated',demand:
								{olddemand: demand, newdemand: newdemand }

							}]);
						})
					})
				}
			})
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.updatedeptdemandstate = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find(
					{ 	"tenderref": req.body.tenderId,
						"department": req.body.deptId
					}, function(err, demands) {
				if (err){
					res.json(err);
				} else {
					demands.forEach(function (value, i) {
					    demands[i].demandstatus = req.body.demState.toString();
						demands[i].save((err,newdemands) => {
							if (err) res.send(err)
						});
					});
					res.json([{status:1,message:'Demands Updated',demands:[]}]);
				}
			})
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.updatedistrictdemandstate = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find(
					{ 	"tenderref": req.body.tenderId,
						"department": req.body.deptId,
						"district": req.body.district
					}, function(err, demands) {
				if (err){
					res.json(err);
				} else {
					demands.forEach(function (value, i) {
					    demands[i].demandstatus = req.body.demState.toString();
						demands[i].save((err,newdemands) => {
							if (err) res.send(err)
						});
					});
					res.json([{status:1,message:'Demands Updated',demands:[]}]);
				}
			})
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.updatedemandstate = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.findById(req.body.demandId, function(err, demand) {
				if (err){
					res.json(err);
				} else {
					demand.demandstatus = req.body.demState.toString();
					demand.save((err,demand) => {
						if (err) res.send(err)
					});
					res.json([{status:1,message:'Demands Updated',demand: demand}]);
				}
			})
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}
exports.updatetenderdemandstate = function (req, res, next) {
	
	UserModel.findById(req.body.userId, function (err, user) {
		
		if (err){
			res.json(err);
		}
		if(user.role==='user' || user.role==='pco'){
			DemandModel.find({"tenderref":req.body.tenderId}, function(err, demands) {
				if (err){
					res.json(err);
				} else {
					demands.forEach(function (value, i) {
					    demands[i].demandstatus = req.body.demState.toString();
						demands[i].save((err,newdemands) => {
							if (err) res.send(err)
						});
					});
					res.json([{status:1,message:'Demands Updated',demands:[]}]);
				}
			})
		}
		else{
			res.json([{status:0,message:'Access Denied',demand:null}]);
		}
	})
}