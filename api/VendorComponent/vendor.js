var controller = require('./vendor.ctrl.js')

module.exports = function(router){
    router.get('/allvendors', controller.allvendors )
    router.get('/qualifiedvendors', controller.qualifiedvendors )
    router.get('/getfinancialvendors', controller.getFinancialVendors )
    router.get('/gettendermeds', controller.getTenderMeds )
    router.get('/getsinglevendor', controller.getSingleVendor )
    router.get('/updateactivestatus', controller.updateActiveStatus )
    router.post('/addvendor', controller.addvendor )
}