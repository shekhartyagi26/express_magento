// the middleware function
require('node-import');
imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
require('../service/category');
require('../service/responseMsg');

var req = {headers: {app_id: config.APP_ID},
    body: {store_id: '1', parent_id: '1', type: 'full'},
    URL: config.URL
};


module.exports = function () {
    var mongoose = require('mongoose');
    mongoose.connect(config.DB_URL, function (err, db) {
        console.log("Connected correctly to server.");

// // pattern for crone wor aafter 5 min '*/5 * * * *'
        new CronJob('*/5 * * * *', function () {
            console.log('You will see this message every second');
            categoryList(req, function (body) {
                if (body.status == 0) {
                } else {
                    var categoryListSchema = mongoose.Schema({}, {
                        strict: false,
                        collection: 'categoryList'
                    });
                    var CollectioncategoryList = conn.model('categoryList', categoryListSchema);
                    var categoryListDB = CollectioncategoryList;

                    categoryListDB.find({
                    }, function (error, result) {
                        if (error) {
                            console.log(error);
                        } else if (result.length == 0 || !result) {
                            var allData = body.msg.children[0].children;
                            for (var a = allData.length - 1; a >= 0; a--) {
                                var allRecords = new categoryListDB({cache: 0, data: allData[a]});
                                allRecords.save(function (err) {
                                    if (err) {
                                        console.log('not saved');
                                    } else {
                                        console.log('saved');
                                    }
                                });
                            }
                        } else {
                            console.log('Record already exist.');
                        }
                    });
                }
            });
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