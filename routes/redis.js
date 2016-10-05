var express = require('express');
var router = express.Router();
var redis = require("redis"),
        client = redis.createClient();

router.post('/flush', function (req, res) {
//FLUSHDB - Removes data from your connection's CURRENT database.//
    client.flushdb(function (err, succeeded) {
        if (err) {
            res.json({err: err, msg: "the redis data is not deleted successfully"});
        } else {
            res.json({status: succeeded, msg: "the redis data is deleted successfully"});
        }
    });
});
module.exports = router;