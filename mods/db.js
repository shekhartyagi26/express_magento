// the middleware function
require('node-import');
imports('config/index');
var CronJob = require('cron').CronJob;
//var moment = require('moment');
require('../service/category');
require('../service/responseMsg');

module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect(config.DB_URL, function (err, db) {
        console.log("Connected correctly to server.");
        console.log('chala');
        var p = 0;
//    Crone_running_time = req.Crone_running_time;

// // pattern for crone wor aafter 5 min '*/5 * * * *'
        new CronJob('*/1 * * * * *', function () {
            if (p == 0) {
                console.log('You will see this message every second');
                categoryProducts(req, function (body) {
                    if (body.status == 0) {
                        oops(res, body.msg);
                    } else {
                        success(res, 1, body.msg);
                    }
                });
            }
            p++;

            // if(moment().format('h:mm:ss') == Crone_running_time ){
            //  console.log(moment().format('h:mm:ss a'));
            // }
            // console.log(moment().tz("Asia/Calcutta|Asia/Kolkata").format());

        }, null, true, 'America/Los_Angeles');
    });

    var Schema = mongoose.Schema;
    var conn = mongoose.connection;

    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    var gfs = Grid(conn.db);

    var app_url_schema = new Schema({
        headers: {type: String, required: true, unique: true},
        url: {type: String, required: true, unique: true},
        status: {type: String, required: true, unique: true}
    });

    var AppUrls = mongoose.model('AppUrls', app_url_schema);
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