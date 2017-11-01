const env = 'dev';
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var path            = require('path');
var config          = require(path.join(__dirname,'config'))[env];
var dbInit          = require(path.join(__dirname,'dbConnection'))(config);
var mongoose        = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port 			= config.port; 
var multer  = require('multer')
var router  = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage }).any()
router.post('/profile', multipartMiddleware, function(req, res) {
		//upload(req, res, function (err) {
	    //if (err) {
	      // An error occurred when uploading
	    //  return
	    //}
	    console.log(req.body,req.files)
	    res.send('dne')
	    // Everything went fine
	  //})

	});

var __staticPath = path.join(__dirname,'app','dist'); // dev path; use ng build --output-path=[folderName]/
// console.log(path.join(__dirname));
app.use('/' , express.static(__staticPath));
app.use('/*', express.static(__staticPath));

app.listen(port);