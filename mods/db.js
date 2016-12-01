require('node-import');
imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
require('../service/category');
require('../service/responseMsg');

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
            // pattern for crone after 5 min '*/5 * * * *'
        new CronJob('* * * * * *', function () {
            var users = AppUrls;
            users.findOne({APP_ID: "com.tethr"}, function (err, user) {
                if (err) {
                    console.log(err)
                } else if (!user) {
                    console.log(user)
                } else {
                    var Cron_running_time = user.Cron_running_time;
                    var IST_timezone = 'IST' + moment().tz("Asia/Kolkata").format('h:mm:ss a');
                    var EST_timezone = 'EST' + moment().tz("Europe/London").format('h:mm:ss a');
                    var PST_timezone = 'PST' + moment().tz("America/Los_Angeles").format('h:mm:ss a');
                    if (IST_timezone == Cron_running_time || PST_timezone == Cron_running_time || EST_timezone == Cron_running_time) {                      
                        console.log('here you can fire api');                    
                    }
                }
            })
        }, null, true);
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