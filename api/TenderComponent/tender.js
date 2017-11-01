var controller = require('./tender.ctrl.js')

module.exports = function(router){
    router.get('/alltenders', controller.alltenders )
    router.get('/allclosedtenders', controller.allclosedtenders )
    router.get('/allprequalifytenders', controller.allPreQualifyTenders )
    router.get('/tendersbydepartment', controller.tendersbydepartment )
    router.post('/addtender', controller.addtender )
    router.get('/locktender', controller.locktender )
    router.get('/closetender', controller.closeTender )
    router.get('/edittender', controller.editTender )
    router.get('/updatetender', controller.updateTender )
    router.get('/gettender', controller.getTender )
    router.get('/tenderqualiprofiles', controller.getQualiProfiles )
}