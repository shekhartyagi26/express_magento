var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();

cron = function (app_urls, app_id) {
// pattern for crone  after 5 min '*/5 * * * *'
    new CronJob('* * * * * *', function () {
        app_urls.findOne({APP_ID: app_id}, function (err, user) {
            if (err) {
                console.log(err)
            } else if (!user) {
                console.log(user)
            } else {
                var cron_running_time = user.cron_running_time;
                var time = moment().tz(timezone).format('h:mm:ss a');
                if (time == cron_running_time) {
                    console.log('here you can fire api');
                }
            }
        })
    }, null, true);
};