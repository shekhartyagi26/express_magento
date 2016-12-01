var CronJob = require('cron').CronJob;
var moment = require('moment');
var jstz = require('jstz');
var timezone = jstz.determine().name();

cron = function (AppUrls) {
    // pattern for crone  after 5 min '*/5 * * * *'
    new CronJob('* * * * * *', function () {
        AppUrls.findOne({APP_ID: "com.tethr"}, function (err, user) {
            if (err) {
                console.log(err)
            } else if (!user) {
                console.log(user)
            } else {
                var Cron_running_time = user.Cron_running_time;
                var time = moment().tz(timezone).format('h:mm:ss a');
                // var EST_timezone = 'EST' + moment().tz("Europe/London").format('h:mm:ss a');
                // var PST_timezone = 'PST' + moment().tz("America/Los_Angeles").format('h:mm:ss a');
                if (time == Cron_running_time) {
                    console.log('here you can fire api');
                }
            }
        })
    }, null, true);
};