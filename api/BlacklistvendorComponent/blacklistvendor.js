var controller = require('./blacklistvendor.ctrl.js')

module.exports = function(router){
    // router.post('/addblacklistrequest', controller.addBlacklistRequest )
    router.get('/allrequestedvendors', controller.allRequestedVendors )
    router.get('/getvendorstats', controller.getVendorStats )
    router.get('/approveblacklist', controller.approveBlacklist )
    router.get('/allblacklistedvendors', controller.allBlacklistedVendors )
}