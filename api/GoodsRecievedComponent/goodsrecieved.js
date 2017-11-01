var controller = require('./goodsrecieved.ctrl.js')

module.exports = function(router){
    router.put('/updategoodsrecieved', controller.updategoodsrecieved )
    router.put('/raiselateissuance', controller.raiselateissuance )
}