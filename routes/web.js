
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
    var body = ({});
    var APP_id = req.headers.app_id;
    var headers = {APP_ID: config.APP_ID, store_id: store_id};
    var URL = req.URL;
    console.log(URL.length);
    if(URL.length > 0){
    var url = URL + '/web/config';
    request_.request(body, headers, url, function (req, response, msg) {
        if (msg == ERROR) {
            console.log(response);
            res.json({status: 0, statuscode: ERR_STATUS, error: response});
        } else if (req.statusCode == ERR_STATUS) {
            res.json({status: 0, statuscode: req.statusCode, body: response});
        } else {
            res.json({status: 1, statuscode: req.statusCode, body: response});
        }
    });
}else{
    res.json({status: 0, statuscode: ERR_STATUS, body: "header is not found in database"});
}


});


module.exports = router;