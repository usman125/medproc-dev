var controller = require('./purchaseorder.ctrl.js')

module.exports = function(router){
    router.get('/allpurchaseorders', controller.allpurchaseorders )
    router.get('/getuserzone', controller.getuserzone )
    router.get('/getuserdemands', controller.getuserdemands )
    router.get('/getclosedtendermeds', controller.getclosedtendermeds )
    router.get('/gettenderpos', controller.getTenderPos )
    router.post('/addpurchaseorder', controller.addpurchaseorder )
}