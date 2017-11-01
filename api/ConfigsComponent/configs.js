var controller = require('./configs.ctrl.js')

module.exports = function(router){
    
    router.get('/configs', controller.allConfigs)
    
    // Zones
    router.get('/allzones', controller.allZones)


    // Districts configs
    router.post('/adddistrict', controller.addDistrict)
    router.get('/alldistricts', controller.allDistrict)
    router.get('/userdistrict', controller.userDistrict)

    // Department configs
    router.get('/alldepartments', controller.allDepartments)
    router.post('/adddepartment', controller.addDepartment)
    router.post('/editdepartment', controller.editDepartment)
    
    // Tehsil configs
    router.get('/alltehsils', controller.allTehsils)
    router.get('/getTehsilsByDistrict', controller.getTehsilsByDistrict)
    router.post('/addtehsil', controller.addTehsil)
    router.post('/edittehsil', controller.editTehsil)
    
    // Facility Type configs
    router.post('/addfacilitytype', controller.addFacilityType)    
    router.post('/editfacilitytype', controller.editFacilityType)    
    
    // Medi Type configs
    router.get('/allmeditype', controller.allMediType)
    router.post('/addmeditype', controller.addMediType)
    router.post('/editmeditype', controller.editMediType)
    
    // Medicine Unit configs
    router.get('/allmediunit', controller.allMediUnit)
    router.post('/addmediunit', controller.addMediUnit)
    router.post('/editmediunit', controller.editMediUnit)
    
    // Facilities configs
    router.post('/addfacility', controller.addFacility)
    router.post('/editfacility', controller.editFacility)
    
    // Medicine meausrement unit configs
    router.get('/allmedimesunit', controller.allMediMesUnit)
    router.post('/addmedimesunit', controller.addMediMesUnit)
    router.post('/editmedimesunit', controller.editMediMesUnit)


}
