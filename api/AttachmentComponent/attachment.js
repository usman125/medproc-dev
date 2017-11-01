var controller = require('./attachment.ctrl.js')

module.exports = function(router){
    router.post('/attachment', controller.attachment )
}


