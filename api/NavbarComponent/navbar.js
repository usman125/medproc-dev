var controller = require('./navbar.ctrl.js')

module.exports = function(router){
    router.get('/getnavbar', controller.getNavBar )
    // router.get('/medicinesbydepartment', controller.medicinesbydepartment )
    // router.post('/addmedicine', controller.addmedicine )
}