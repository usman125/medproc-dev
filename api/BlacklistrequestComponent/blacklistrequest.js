var controller = require('./blacklistrequest.ctrl.js')

module.exports = function(router){
    router.post('/addblacklistrequest', controller.addBlacklistRequest )
    router.get('/allblacklistrequests', controller.allBlacklistRequests )
    // router.get('/medicinesbydepartment', controller.medicinesbydepartment )
    // router.post('/addmedicine', controller.addmedicine )
}