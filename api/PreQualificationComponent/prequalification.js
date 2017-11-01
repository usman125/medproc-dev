var controller = require('./prequalification.ctrl.js')

module.exports = function(router){
  router.get('/allprequaliprofiles', controller.allPreQualiProfiles);
  router.get('/singleprofile', controller.getSingleProfile);
  router.post('/addprequaliprofiles', controller.addPreQualiProfiles);
}