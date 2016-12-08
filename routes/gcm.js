imports('config/index');
var express = require('express');
var router = express.Router();
var FCM = require("fcm-node");

router.post('/add', function (req, res) {
    var add_gsm = req.Collection_gsm;
    var gsm_id = req.body.gsm_id;
    var record = new add_gsm({
        gsm_id: gsm_id,
    });
    if (gsm_id.length > 0) {
        record.save(function (err, result) {
            if (err) {
                res.json({status: 0, message: err})
            } else {
                res.json({status: 1, gsm_id: gsm_id, message: " success"});
            }
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/pushmessage', function (req, res) {
    var serverKey = req.body.serverKey; //server key
    var fcm = new FCM(serverKey);
    var token = req.body.token; //token here
    var message = {
        to: token,
        collapse_key: 'your_collapse_key',
        notification: {
            title: 'hello',
            body: 'test'
        },
        data: {
            my_key: 'my value',
            contents: "http://www.news-magazine.com/world-week/21659772"
        }
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
});

module.exports = router;