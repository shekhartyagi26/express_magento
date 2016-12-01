require('node-import');
imports('config/index');
require('../service/category');
require('../service/responseMsg');
require('../service/cron');



module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect(config.DB_URL, function (err, db) {
        var app_url_schema = new Schema({
            headers: {type: String, required: true, unique: true},
            url: {type: String, required: true, unique: true},
            status: {type: String, required: true, unique: true},
            Cron_running_time: {type: String, required: true, unique: true}
        });
        var AppUrls = mongoose.model('AppUrls', app_url_schema);
        cron(AppUrls);
    });
    var Schema = mongoose.Schema;
    var conn = mongoose.connection;
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    conn.on('error', function (err) {
        process.exit();
    });

    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.app = AppUrls;
        next();
    };
};