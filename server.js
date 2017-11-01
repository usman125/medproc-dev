
const env = 'dev';

var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var path            = require('path');
var fs 				= require('fs');
var mongoose        = require('mongoose');
var _overides       = require(path.join(__dirname,'lib','cupcake.js'))();

var routes          = require(path.join(__dirname,'routes'));
var config          = require(path.join(__dirname,'config'))[env];
var dbInit          = require(path.join(__dirname,'dbConnection'))(config);

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
// var uristring =
// process.env.MONGOLAB_URI ||
// process.env.MONGOHQ_URL ||
// 'mongodb://localhost:27017/eProcurement_dev';

// // The http server will listen to an appropriate port, or default to
// // port 5000.
// var theport = process.env.PORT || 5000;

// // Makes connection asynchronously.  Mongoose will queue up database
// // operations and release them when the connection is complete.
// mongoose.connect(uristring, function (err, res) {
//   if (err) {
//   console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//   } else {
//   console.log ('Succeeded connected to: ' + uristring);
//   }
// });

var port 			= config.port;                     // set our por
var router 			= express.Router();
// get an instance of the express Router

app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

routes(router);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/vendorcontracts', express.static(path.join(__dirname, 'vendorcontracts')))
app.use('/purchaseorders', express.static(path.join(__dirname, 'purchaseorders')))
app.use('/api', router);

// IF ALL FAILS TURN TO THY LORD AND WISH FOR A MIRACLE, MEANWHILE OPEN THE APP BY DEFAULT \m/
var __staticPath = path.join(__dirname,'app','dist'); // dev path; use ng build --output-path=[folderName]/
// console.log(path.join(__dirname));
app.use('/' , express.static(__staticPath));
app.use('/*', express.static(__staticPath));

app.listen(port);

console.log('\n===================================');
console.log('Angular 2 Application hosted on:  ' + port);
console.log('       RESTful API Endpoints on:  ' + port + ' /api');
console.log('===================================\n');
