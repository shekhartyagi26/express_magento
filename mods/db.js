require('node-import');
imports('config/index');
require('../service/cron');
require('./schema');
require('../service/magento');
var mongoose = require('mongoose');
var _ = require('lodash');

//var Schema = mongoose.Schema;
var conn = mongoose.connection;
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


module.exports = function () {

    var app_urls = mongoose.model('AppUrls', app_url_schema);

    mongoose.connect(config.DB_URL, function (err, db) {

        getActiveInstallations(app_urls);

    });

    var gsm_id = mongoose.model('GsmId', gsmSchema);
    conn.on('error', function (err) {
        process.exit();
    });

    var gfs = Grid(conn.db);
    return function (req, res, next) {
        req.mongo = conn;
        req.gfs = gfs;
        req.app = app_urls;
        req.Collection_gsm = gsm_id;
        next();
    };

};