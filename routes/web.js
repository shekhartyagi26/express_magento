var express = require('express');
var router = express.Router();
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
require('node-import');
imports('config/index');
imports('config/constant');
const request_ = require('../service/request');

router.post('/config', function (req, res) {
    var headers = req.headers.app_id;
    var verify = req.Collection;
    request_.headerVerify(headers, verify, function (headers_, url_, msg) {
        var body = ({});
        var headers = {APP_ID: config.APP_ID};
        var url = url_ + '/web/config';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    });

});


module.exports = router;