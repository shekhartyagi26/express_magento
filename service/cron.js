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
                    console.log('You will see this message every second');
                    // categoryList(req, function (body) {
                    //     if (body.status == 0) {
                    //     } else {
                    //         var categoryListDB = CollectioncategoryList;
                    //         categoryListDB.find({
                    //         }, function (error, result) {
                    //             if (error) {
                    //                 console.log(error);
                    //             } else if (result.length == 0 || !result) {
                    //                 var allData = body.msg.children[0].children;
                    //                 for (var a = allData.length - 1; a >= 0; a--) {
                    //                     var allRecords = new categoryListDB({cache: 0, data: allData[a]});
                    //                     allRecords.save(function (err) {
                    //                         if (err) {
                    //                             console.log('not saved');
                    //                         } else {
                    //                             console.log('saved');
                    //                         }
                    //                     });
                    //                 }
                    //             } else {
                    //                 console.log('Record already exist.');
                    //             }
                    //         });
                    //     }
                    // });
//                }
            }
        });
    }, null, true);
};