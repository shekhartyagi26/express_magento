var express = require('express');
var router = express.Router();
var CronJob = require('cron').CronJob;
var moment = require('moment');
var sharp = require('sharp');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');


 // imagemin(["public/original_image/" + 'default.jpg'], 'public/minify/' + ima, {
 //                   plugins: [
 //                   imageminMozjpeg(),
 //                   imageminPngquant({quality: '5'})
 //                   ]
 //                  }).then(files => {
 //                       if (files[0].path !== null) {
 //                       		console.log('done');
 //                           // callback(200, "done", config.IMAGE_MINIFY_URL+image_fetch_url );
 //                       } else {
 //                       	console.log(err)
 //                           // callback(500, "oops! some error occured");
 //                       }
 //             })


// var width = '200';
// var x = 'filename.jpg';
// var f = x.substr(0, x.lastIndexOf('.'));
// console.log(f+'.webp')
// var image_name = "default.jpg";
// console.log(image_name.split('.').pop());
// var res = str.replace(".", "W3Schools");
// sharp('public/original_image/' + 'default.jpg')
//                                 .resize(200)
//                                 .toFile('public/'+'default.webp', function (err) {
//                                     if (err) {
//                                         // callback(500, err);
//                                         console.log(err)
//                                     } else if (err === null) {
//                                     	console.log('done')
//                                         // callback(200, "done", config.IMAGE_URL + filename + image_name);
//                                     } else {
//                                         // callback(500, "oops! some error occured");
//                                     }
//                                 });

router.post('/db', function (req, res) {
		Crone_running_time =	req.Crone_running_time;
console.log(moment().tz("India/Asia").format());



// new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
		
// 	if(moment().format('h:mm:ss') == Crone_running_time ){
//   console.log(moment().format('h:mm:ss a'));
// 	}
// }, null, true, 'America/Los_Angeles');
});
module.exports = router;