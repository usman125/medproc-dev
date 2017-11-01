var controller = require('./user.ctrl.js')

module.exports = function(router){

    router.get('/user/:userId', controller.getSingleUserById )
    router.get('/edituser', controller.getSingleUserToEdit )
    router.post('/adduser', controller.addUser )
    router.get('/allusers', controller.allusers )
    router.post('/edituser', controller.editUser )
    
}