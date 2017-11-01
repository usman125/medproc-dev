var controller = require('./techqualification.ctrl.js')

module.exports = function(router){
  router.get('/alltechqualiprofiles', controller.allTechQualiProfiles);
  router.get('/singletechprofile', controller.getSingleTechProfile);
  router.post('/addtechqualiprofile', controller.addTechQualiProfile);
}