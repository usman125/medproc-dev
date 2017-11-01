const UserModel = model('user');

exports.login = function(req,res,next){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log("call from login",req.body.username);
    UserModel.find().
        where('username').equals(username).
        where('password').equals(password).
        exec(function(err, users){
            if(err){
                res.send(err);
            }
            res.json(users);
    });
        // UserModel.find(function(err, users){
        //     if(err){
        //         res.send(err);
        //     }
        //     res.json(users);
        // });
        // if(error){
        //     req.ApiError = {
        //         error: true,
        //         error_code: 'server_error',
        //         message: 'Internal Server Error',
        //     }
        // } else if(x == null) {
        //     emptyDocument(req,res,next);
        // } else {
        //     res.send(x);
        // }
    // })

}

exports.authenticate = function(req,res,next){
    res.send("Authenticate Responce");
}

exports.verify = function(req,res,next){
    // res.send("Verify Responce");
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log("call from Verify");
    UserModel.findOne({
        $or: [ { username: username }, { email: email } ]
    }).then(function(err, users){
            if(err){
                res.send(err);
            }
            res.json(users);
        });
}