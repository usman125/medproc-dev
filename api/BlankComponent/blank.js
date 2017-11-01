var controller = require('./blank.ctrl.js')

module.exports = function(router){

    router.get('/blank', controller.blankFunction )

}