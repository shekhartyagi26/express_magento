// the middleware function
require('node-import');
imports('config/index');

module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect(config.DbUrl);
    var Schema = mongoose.Schema;
    var conn = mongoose.connection;

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);
 
    var app_url_schema = new Schema({
        headers: {type: String, required: true, unique: true},
        url: {type: String, required: true, unique: true}
    });
    var AppUrls = mongoose.model('AppUrls', app_url_schema);
    conn.on('error', function (err) {
        process.exit();
    })
    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.app = AppUrls;
        next();
    }

};