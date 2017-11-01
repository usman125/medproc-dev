const UserModel = model('user');
exports.getSingleUserById = function(req,res,next){
    // next(); IF ERROR OCCURS
    // res.send("SINGLE USER");
    UserModel.findById(req.params.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role === 'admin' || user.role === 'user'){
            UserModel.find().
                where('_id').equals(req.params.userId).
                exec(function(err, user){
                    if(err){
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
exports.getSingleUserToEdit = function(req,res,next){
    // next(); IF ERROR OCCURS
    // res.send("SINGLE USER");
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role === 'admin'){
            UserModel.find().
                where('_id').equals(req.query.editUserId).
                exec(function(err, user){
                    if(err){
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

exports.addUser = function(req,res,next){
    var saveUser = model('user'); 
    var newUser = new saveUser({name: req.body.name,
                                email: req.body.email,
                                password: req.body.password,
                                username: req.body.username,
                                district: req.body.district,
                                department: req.body.department,
                                designation: req.body.designation,
                                tehsil: req.body.tehsil,
                                role: req.body.role});
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        if(user.role==='admin'){
            newUser.save(function(err, result){
                if(err){ res.json(err); }
                res.json([{status:1,message:'Access Granted',result:result}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',result:[]}]);
        }
    }) 
}
exports.allusers = function(req, res, next){
    UserModel.findById(req.query.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        console.log("USER___",user,req.query.userId)
        if(user.role==='admin' || user.role==='pco'){
            UserModel.find(function(err, users){
                if(err){
                    res.send(err);
                }
                res.json([{status:1,message:'Access Granted',users:users}]);
            });
        }
        else {
            res.json([{status:0,message:'Access Denied',users:[]}]);
        }
    }) 
}
exports.editUser = function(req, res, next){
    UserModel.findById(req.body.userId, function (err, user) {
        if (err) {
            res.json(err);
        }
        console.log("USER___",user,req.body.userId)
        if(user.role==='admin'){
            // UserModel.find(function(err, users){
            //     if(err){
            //         res.send(err);
            //     }
            //     res.json([{status:1,message:'Access Granted',user:user}]);
            // });
            UserModel.findByIdAndUpdate(req.body.updateuserId, {
                $set: {
                    "name": req.body.name,
                    "password": req.body.password,
                    "email": req.body.email
                }
            }, { multi: false,upsert: false}, function(err, user){
                if(err){
                    res.send(err);
                }
                res.json([{status:1,message:'Access Granted',user:user}]);
            })
        }
        else {
            res.json([{status:0,message:'Access Denied',user:[]}]);
        }
    }) 
}
