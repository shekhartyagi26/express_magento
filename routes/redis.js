var express = require('express');
var router = express.Router();
var redis = require("redis"),
        client = redis.createClient();

router.post('/flush', function (req, res) {
    var HeaderId_ = req.HeaderId;
    client.select(HeaderId_, function (err, res) {
        client.set('key', 'string');
    });
    client.flushdb(function (err, succeeded) {
        if (err) {
            res.json({err: err, msg: "the redis data is not deleted successfully"});
        } else {
            res.json({status: succeeded, msg: "the redis data is deleted successfully"});
        }
    });
});

router.post('/set_status', function (req, res) {
    var dtabase = req.app;
    var APP_ID = req.headers.app_id;
    var status = req.body.status;

    dtabase.find({APP_ID: APP_ID}, function (err, result) {
        if (err) {
            res.json({status: '0', msg: err});
        } else if (status == 'enabled' || status == 'disabled') {
            dtabase.update({APP_ID: APP_ID}, {
                status: status,
            }, function (err, result) {
                if (err) {
                    res.json({status: '0', msg: err});
                } else {
                    res.json({status: '1', msg: 'the status is successfully changed to ' + status});
                }
            });
        } else {
            res.json({status: '0', msg: "the status is not changed successfully,  you have to set status enabled or disabled"});
        }
    });
});

router.post('/check_status', function (req, res) {
    var dtabase = req.app;
    var APP_ID = req.headers.app_id;
    dtabase.find({APP_ID: APP_ID}, function (err, result) {
        if (err) {
            res.json({status: '0', msg: err});
        } else {
            res.json({status: '1', current_status: result[0].status});
        }
    });
});

module.exports = router;