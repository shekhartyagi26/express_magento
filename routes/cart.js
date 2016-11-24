require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();
var request_ = require('../service/request');

router.all('/cart', function (req, res) {
    var productid = req.body.productid;
    var secret = req.body.secret;
    var access_token = req.headers.authorization;
    var store_id = req.body.store_id;
    var APP_ID = req.headers.app_id;
    var URL = req.URL;
    if (secret == UNDEFINE && access_token == UNDEFINE && store_id == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({productid: productid, secret: secret, store_id: store_id});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
        var url = URL + '/cart/cart/';
        request_.request(body, headers, url, function (req, response, msg) {
            if (msg == ERROR) {
                res.json({status: 0, statuscode: ERR_STATUS, error: response});
            } else if (req.statusCode == ERR_STATUS) {
                res.json({status: 0, statuscode: req.statusCode, body: response});
            } else {
                res.json({status: 1, statuscode: req.statusCode, body: response});
            }
        });
    }
});

module.exports = router;