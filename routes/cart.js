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
    if (secret == UNDEFINE && access_token == UNDEFINE && store_id == UNDEFINE) {
        res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
    } else {
        var body = ({productid: productid, secret: secret, store_id: store_id});
        var url = '/cart/cart/';
        request_.request(req, body, url, function (req, response, msg) {
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