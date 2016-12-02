require('node-import');
imports('config/index');
require('../service/cron');

module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect(config.DB_URL, function (err, db) {
        var app_url_schema = new Schema({
            headers: {type: String, required: true, unique: true},
            url: {type: String, required: true, unique: true},
            status: {type: String, required: true, unique: true},
            cron_running_time: {type: String, required: true, unique: true}
        });
        var AppUrls = mongoose.model('AppUrls', app_url_schema);

        var categoryListSchema = mongoose.Schema({}, {
            strict: false,
            collection: 'categoryList'
        });
        var CollectioncategoryList = conn.model('categoryList', categoryListSchema);

        var homeSchema = mongoose.Schema({}, {
            strict: false,
            collection: 'homeSlider'
        });
        var homeSlider = conn.model('homeSlider', homeSchema);

        cron(AppUrls, CollectioncategoryList, homeSlider);
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