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

    dtabase.find({APP_ID: APP_ID}, function (err, result) {
        if (err) {
            res.json({status: '0', msg: err});
        } else {
            if (result.length == 0) {
                res.json({status: '0', msg: "the data is not found in database"});
            } else {
                result = result[0];
                if (result.status == 'enabled') {
                    dtabase.update({APP_ID: APP_ID}, {
                        status: "disabled",
                    }, function (err, result) {
                        if (err) {
                            res.json({status: '0', msg: err});
                        } else {
                            res.json({status: '1', msg: "the status is successfully changed to disabled"});
                        }
                    });
                } else if (result.status == 'disabled') {
                    dtabase.update({APP_ID: APP_ID}, {
                        status: "enabled",
                    }, function (err, result) {
                        if (err) {
                            res.json({status: '0', msg: err});
                        } else {
                            res.json({status: '1', msg: "the status is successfully changed to enabled"});
                        }
                    });
                } else {
                    res.json({status: '0', msg: "the status is not chnaged successfully"});
                }
            }
        }
    });
});


module.exports = router;