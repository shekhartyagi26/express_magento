var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
var moment = require('moment');

var IST_timezone = moment().tz("Asia/Kolkata").format('h:mm:ss a');
var EST_timezone = moment().tz("Europe/London").format('h:mm:ss a');
var PST_timezone = moment().tz("America/Los_Angeles").format('h:mm:ss a');

router.post('/db', function (req, res) {
    Crone_running_time = req.Crone_running_time;

// // pattern for crone wor aafter 5 min '*/5 * * * *'
    new CronJob('* * * * * *', function () {
        console.log('You will see this message every second');
        if (moment().format('h:mm:ss a') > '11:43:22 am') {
            console.log(moment().format('h:mm:ss a'));
        }
    }, null, true, 'America/Los_Angeles');
});
module.exports = router;