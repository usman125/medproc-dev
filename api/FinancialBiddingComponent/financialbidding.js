var controller = require('./financialbidding.ctrl.js')

module.exports = function(router){
    router.get('/getqualifiedvendors', controller.getqualifiedvendors )
    router.get('/allfinancialbids', controller.allfinancialbids )
    router.get('/alltendormeds', controller.alltendormeds )
    router.get('/singletendermeds', controller.singleTenderMeds )
    router.get('/tenderfinancialbids', controller.tenderfinancialbids )
    router.post('/addfinancialbid', controller.addfinancialbid )
}