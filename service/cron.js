imports('config/index');
var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();
require('./category');

cron = function (app_urls, CollectioncategoryList, app_id) {
// pattern for crone  after 5 min '*/5 * * * *'
    new CronJob('* * * * * *', function () {
        app_urls.findOne({APP_ID: app_id}, function (err, user) {
            var req = {headers: {app_id: config.APP_ID},
                body: {store_id: '1', parent_id: '1', type: 'full'},
                URL: config.URL
            };
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
                var categoryListDB = CollectioncategoryList;
                categoryListDB.find({
                }, function (error, result) {
                    if (error) {
                        console.log(error);
                    } else if (result.length == 0 || !result) {
                        var req = {headers: {app_id: config.APP_ID, isAdmin: true},
                            body: {store_id: '1', parent_id: '1', type: 'full'},
                            URL: config.URL
                        };
                        categoryList(req, function (body) {
                            if (body.status == 0) {
                            } else {
                                var allData = body.msg.children[0].children;
                                for (var a = allData.length - 1; a >= 0; a--) {
                                    var allRecords = new categoryListDB({cache: 0, categoryId: allData[a].id,
                                        categoryName: allData[a].name});
                                    allRecords.save(function (err) {
                                        if (err) {
                                            console.log('not saved');
                                        } else {
                                            console.log('saved');
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        for (var p = 0; p < result.length; p++) {
                            var row = result[p];
                            var inputId = row.get('categoryId');
                            categoryListDB.update({
                                categoryId: inputId
                            }, {
                                $set: {
                                    cache: '1'
                                }
                            }, function (err) {
                                if (!err) {
                                    console.log('Update Done');
                                    var myReq = {headers: {app_id: config.APP_ID},
                                        body: {id: inputId, limit: '10', mobile_width: '300', pageno: '1'},
                                        URL: config.URL
                                    };
                                    console.log(inputId);
                                    console.log('***********');
                                    categoryProducts(myReq, function (body) {
                                        if (body.status == 0) {
                                            console.log('error');
                                        } else {
                                            console.log(inputId);
                                            console.log('-----------------');
                                            console.log(body.msg);
                                            console.log(body.msg.length);
                                            console.log('-----------------');


//                                    var categoryProductsDB = CollectioncategoryList;
//                                    categoryProductsDB.update({
//                                        'categoryId': inputId
//                                    }, {
//                                        $set: {
//                                            children: body.msg
//                                        }
//                                    }, function (err) {
//                                        if (!err) {
//                                            console.log('Update Done');
//                                        } else {
//                                            console.log('my error');
//                                        }
//                                    });
                                        }
                                    });

                                } else {
                                    console.log('my error');
                                }
                            });
                        }
                    }
                });
//                }
            }
        });
    }, null, true);
};