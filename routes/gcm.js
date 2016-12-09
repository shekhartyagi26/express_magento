var express = require('express');
var router = express.Router();
var FCM = require("fcm-node");

router.post('/add', function (req, res) {
    var add_gsm = req.Collection_gsm;
    var gsm_id = req.body.gsm_id;
    var record = new add_gsm({
        gsm_id: gsm_id
    });
    if (gsm_id.length > 0) {
        record.save(function (err, result) {
            if (err) {
                res.json({status: 0, message: err});
            } else {
                res.json({status: 1, gsm_id: gsm_id, message: " success"});
            }
        });
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/pushmessage', function (req, res) {
    var serverKey = 'AAAABZ9YBbQ:APA91bE1JXKpTGVp9ypCoT694hZ_HYMKUb7n1Aq4L32ydF5IgdtGhdDum5nc_UDPzJ72rBsUe8TI_Z8Tcdhb2RGOmVSnzyA8pBeyIVxA5RvVyxnz7VYhJVLKs6HfkHsHaictRyDp87dX';
    var fcm = new FCM(serverKey);
    var token = "d6Zs8WEhQ6A:APA91bFSAke13kcf5Uc3xUyMVtfpG5e-WIjZMfXbNNAe9vvuSoM_G3SkgTnLCeeH1xnJPQK5Rpk_DRo4mE6AdBme480fZwGNM428cMOpec4j3mjGd9yVMHdeItgWb98EAaWniETESf_J";
    var message = {
        to: token,
        collapse_key: 'your_collapse_key',
        notification: {title: 'hello', body: 'test'},
        data: {my_key: 'my value', contents: "https://excellencetechnologies.in/"}
    };
    fcm.send(message, function (err, response) {
        if (err) {
            res.json({status: 0, message: err});
        } else {
            res.json({status: 1, message: response});
        }
    });
});

//code for ios apn
//     var deviceToken = 'regTokens';
//     var note = new apn.Notification();
//     note.badge = 1;
//     note.contentAvailable = 1;
//         if (message.params.data.body) {
//             note.alert = '\uD83D\uDCE7 \u2709 ' + message.params.data.body;
//         } else {
//             note.alert = '\uD83D\uDCE7 \u2709 ' + message.params.notification.body;
//         }
//         note.payload = {"title": message.params.data.title, 'room_id': message.params.data.room_id, 'icon': message.params.data.icon, 'image': message.params.data.image, 'message': message.params.data.body};
//         note.topic = "com.excellence.chatt";
//             var options = {
//                 gateway: 'gateway.push.apple.com', // this URL is different for Apple's Production Servers and changes when you go to production
//                 production: true,
//                 cert: 'cert.pem', // ** NEED TO SET TO YOURS
//                 key: 'Key.pem', // ** NEED TO SET TO YOURS
//                 passphrase: 'pass', // ** NEED TO SET TO YOURS
//             }
//             var apnProvider = new apn.Provider(options);
//                 apnProvider.send(note, deviceToken).then((result) = > {
//                     callback(true, result);
//                 });

module.exports = router;