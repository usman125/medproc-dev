var controller = require('./vendorcontract.ctrl.js')

module.exports = function(router){
  router.get('/allvendorcontracts', controller.allVendorContracts);
  router.get('/getcontractfile', controller.getContractFile);
  router.get('/gettendercontracts', controller.getTenderContracts);
  router.post('/addvendorcontract', controller.addVendorContract);
}