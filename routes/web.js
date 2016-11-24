require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.post('/config', function (req, res) {
    var store_id = req.body.store_id;
    var body = ({store_id: store_id});
    request_.request(req, body, '/web/config', function (req, response, msg) {
        if (msg == ERROR) {
            res.json({status: 0, statuscode: ERR_STATUS, error: response});
        } else if (req.statusCode == ERR_STATUS) {
            res.json({status: 0, statuscode: req.statusCode, body: response});
        } else {
            res.json({status: 1, statuscode: req.statusCode, body: response});
        }
    });
});

router.post('/getAllowedCountries', function (req, res) {
    var store_id = req.body.store_id;
    var body = ({store_id: store_id});
    request_.request(req, body, '/web/getAllowedCountries', function (req, response, msg) {
        if (msg == ERROR) {
            res.json({status: 0, statuscode: ERR_STATUS, error: response});
        } else if (req.statusCode == ERR_STATUS) {
            res.json({status: 0, statuscode: req.statusCode, body: response});
        } else {
            res.json({status: 1, statuscode: req.statusCode, body: response});
        }
    });
});

module.exports = router;