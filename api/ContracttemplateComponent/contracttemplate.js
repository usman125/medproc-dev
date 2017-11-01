var controller = require('./contracttemplate.ctrl.js')

module.exports = function(router){
  router.get('/allcontracttemplates', controller.getAllContractTemplates)
  router.get('/getsingletemplate', controller.getSingleTemplate)
  router.post('/addcontracttemplate', controller.addContractTemplate)
}