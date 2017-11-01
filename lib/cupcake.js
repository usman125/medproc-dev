var path = require('path');

module.exports = function(){

    global.model = function(fileName){
        return require(path.join(__dirname,'..','model',fileName));
    }

    global.lib = function(fileName){
        return require(path.join(__dirname,'lib',fileName));
    }

    global.component = function(component_name){
        return require(path.join(__dirname,'..','api',component_name+'Component',component_name.toLowerCase()+'.js'))
    }

    global.emptyDocument = function(req,res,next){
        req.errorResponse = {
            error: true,
            error_code: 'empty_document',
            message: 'Not Found'
        }
        next();
    }

    global.serverError = function(req,res,next){
        req.errorResponse = {
            error: true,
            error_code: 'server_error',
            message: 'Unexpected Error Occurred'
        }
    }
}