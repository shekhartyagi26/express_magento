
var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
require('node-import');
imports('config/index');
imports('config/constant');

const request_ = require('../service/request');


router.post('/config', function (req, res) {
    var store_id = req.body.store_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (store_id == UNDEFINE && APP_ID == UNDEFINE && URL == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else if (store_id.length > 0 && APP_ID.length > 0 && URL.length > 0 && access_token.length > 0) {
        var body = ({});
        var url = URL + '/web/config';
        var headers = {APP_ID: APP_ID, store_id: store_id};
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    } else {
        res.json({status: 0, statuscode: ERR_STATUS, msg: INVALID});
    }
});


module.exports = router;