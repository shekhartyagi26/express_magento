var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
var moment = require('moment');

router.post('/db', function (req, res) {
		Crone_running_time =	req.Crone_running_time;

// // pattern for crone wor aafter 5 min '*/5 * * * *'
new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
		
	// if(moment().format('h:mm:ss') == Crone_running_time ){
 //  console.log(moment().format('h:mm:ss a'));
	// }
	// console.log(moment().tz("Asia/Calcutta|Asia/Kolkata").format());

}, null, true, 'America/Los_Angeles');
});
module.exports = router;