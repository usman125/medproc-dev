var mongoose = require('mongoose');
const UserModel = model('user');
const NavbarModel = model('navbar');

exports.getNavBar = function(req, res, next) {

	var navbar = [
			
			{"name":"Users","route":"home","role":"admin", "icon":"ti-user"},
	    {"name":"Vendors","route":"vendors","role":"admin", "icon":"ti-briefcase"},
	    {"name":"Tenders","route":"tenders","role":"admin", "icon":"ti-files"},
	    {"name":"Medicines","route":"medicines","role":"admin", "icon":"ti-paint-bucket"},
	    {"name":"Blacklist Vendor","route":"blacklistvendor","role":"admin", "icon":"ti-na"},
	    {"name":"Configuration","route":"configs","role":"admin", "icon":"ti-settings"},
	    {"name":"Logout","route":"","role":"admin", "icon":"ti-shift-left"},

	    {"name":"Dashboard","route":"pcohome","role":"pco", "icon":"ti-panel"},
	    {"name":"Demands","route":"tenders","role":"pco", "icon":"ti-files"},
	    {"name":"Contract","route":"contracts","role":"pco", "icon":"ti-files"},
	    {"name":"Vendor Pre-Qualification","route":"vendorprequali","role":"pco", "icon":"ti-write"},
	    {"name":"Vendor Technical-Qualification","route":"vendortechquali","role":"pco", "icon":"ti-write"},
	    {"name":"Financial Bidding","route":"financialbidding","role":"pco", "icon":"ti-write"},
	    {"name":"Logout","route":"","role":"pco", "icon":"ti-shift-left"},

	    {"name":"Contract Templates","route":"contracttemplates","role":"deo", "icon":"ti-layout-list-post"},
	    {"name":"Pre-Qualification Profiles","route":"prequalification","role":"deo", "icon":"ti-files"},
	    {"name":"Technical-Qualification Profiles","route":"techqualification","role":"deo", "icon":"ti-files"},
	    {"name":"Logout","route":"","role":"deo", "icon":"ti-shift-left"},

	    {"name":"Dashboard","route":"userdashboard","role":"user", "icon":"ti-panel"},
	    {"name":"Demands","route":"demands","role":"user", "icon":"ti-clipboard"},
	    {"name":"Purchase Order","route":"purchaseorder","role":"user", "icon":"ti-clipboard"},
	    {"name":"Goods Recieved","route":"goodsrecieved","role":"user", "icon":"ti-clipboard"},
	    {"name":"Blacklist Vendor Request","route":"blacklistrequest","role":"user", "icon":"ti-na"},
	    {"name":"Logout","route":"","role":"user", "icon":"ti-shift-left"}
    ]

			//NavbarModel.find(function(err, navbar) {
			//	if (err) {
			//		res.json([{status:0,message:'Error',error:err}]);
			//	}
				res.json([{status:1,message:'Access Granted',navbar:navbar}]);
			//});

}