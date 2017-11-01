var controller = require('./vendorprequali.ctrl.js')

module.exports = function(router){
  router.get('/allvendorprequaliprofiles', controller.allVendorPreQualiProfiles);
  router.post('/addvendorprequaliprofile', controller.addVendorPreQualiProfile);
  router.post('/updatevendorprequaliprofile', controller.updateVendorPreQualiProfile);
  router.get('/editvendorprequaliprofile', controller.editVendorPreQualiProfile);
  router.get('/getprequaliedvendors', controller.getPreQualiedVendors);
  // router.get('/singleprofile/:profileId', controller.getSingleProfile);
  // router.post('/addprequaliprofiles', controller.addPreQualiProfiles);
}