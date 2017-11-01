var controller = require('./medicine.ctrl.js')

module.exports = function(router){
    router.get('/allmedicines', controller.allmedicines )
    router.get('/medicinesbydepartment', controller.medicinesbydepartment )
    router.post('/addmedicine', controller.addmedicine )
}