var path        = require('path')
var mongoose    = require('mongoose');
    mongoose.Promise = require('bluebird')

module.exports = function (config) {
    var db = mongoose.connection;
    var dbString = config.dbString;

    db.on('connecting', function () {
        console.log('connecting to MongoDB...');
    });

    db.on('error', function (error) {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function () {
        console.log('MongoDB connected!');
    });
    db.once('open', function () {
        // console.log('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        console.log('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
        console.log('MongoDB disconnected!');
        mongoose.connect(dbString, { useMongoClient: true });
    });

    mongoose.connect(dbString, { useMongoClient: true });
}