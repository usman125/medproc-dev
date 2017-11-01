var controller = require('./vendortechquali.ctrl.js')

module.exports = function(router){
  router.get('/allvendortechqualiprofiles', controller.allVendorTechQualiProfiles);
  router.post('/addvendortechqualiprofile', controller.addVendorTechQualiProfile);
  router.post('/updatevendortechqualiprofile', controller.updateVendorTechQualiProfile);
  router.get('/editvendortechqualiprofile', controller.editVendorTechQualiProfile);
  // router.get('/singleprofile/:profileId', controller.getSingleProfile);
  // router.post('/addprequaliprofiles', controller.addPreQualiProfiles);
}