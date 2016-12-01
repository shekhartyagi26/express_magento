imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();
require('./category');

var req = {headers: {app_id: config.APP_ID},
    body: {store_id: '1', parent_id: '1', type: 'full'},
    URL: config.URL
};

cron = function (AppUrls, CollectioncategoryList) {
    // pattern for crone  after 5 min '*/5 * * * *'
    new CronJob('*/1 * * * *', function () {
        AppUrls.findOne({APP_ID: "com.tethr"}, function (err, user) {
            if (err) {
                console.log(err);
            } else if (!user) {
                console.log(user);
            } else {
                var cron_running_time = user.cron_running_time;
                var time = moment().tz(timezone).format('h:mm:ss a');
//                if (time == cron_running_time) {
//                    console.log('here you can fire api');
                console.log('You will see this message every minute');



                categoryList(req, function (body) {
                    if (body.status == 0) {
                    } else {
                        var categoryListDB = CollectioncategoryList;
                        categoryListDB.find({
                        }, function (error, result) {
                            if (error) {
                                console.log(error);
                            } else if (result.length == 0 || !result) {
                                var allData = body.msg.children[0].children;
                                for (var a = allData.length - 1; a >= 0; a--) {
                                    var allRecords = new categoryListDB({cache: 0, itemId: allData[a].id});
                                    allRecords.save(function (err, result) {
                                        if (err) {
                                            console.log('not saved');
                                        } else {
                                            console.log('saved');
                                        }
                                    });
                                }
                            } else {
                                for (var p = 0; p < result.length; p++) {
                                    var row = result[p];
                                    var inputId = row.get('itemId');
                                    var myReq = {headers: {app_id: config.APP_ID},
                                        body: {id: inputId, limit: '10', mobile_width: '300', pageno: '1'},
                                        URL: config.URL
                                    };
                                    categoryProducts(myReq, function (body) {
                                        if (body.status == 0) {
                                            console.log('error');
                                        } else {
                                            var categoryProductsDB = CollectioncategoryList;
                                            categoryProductsDB.update({
                                                'itemId': inputId
                                            }, {
                                                $set: {
                                                    children: body.msg
                                                }
                                            }, function (err) {
                                                if (!err) {
                                                    console.log('Update Done');
                                                } else {
                                                    console.log('my error');
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
//                }
            }
        });
    }, null, true);
};