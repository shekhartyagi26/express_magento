var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
//var moment = require('moment');
require('../service/category');

var IST_timezone = moment().tz("Asia/Kolkata").format('h:mm:ss a');
var EST_timezone = moment().tz("Europe/London").format('h:mm:ss a');
var PST_timezone = moment().tz("America/Los_Angeles").format('h:mm:ss a');

router.post('/db', function (req, res) {
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

module.exports = router;