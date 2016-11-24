require('node-import');
require('../service/secret');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/cart', function (req, res) {
    var productid = req.body.productid;
    var access_token = req.headers.authorization;
    var store_id = req.body.store_id;
    isAuth(req, function (secret) {
        if (secret.length == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            if (access_token == UNDEFINE && store_id == UNDEFINE) {
                res.json({status: 0, statuscode: ERR_STATUS, body: UNDEFINE});
            } else {
                var body = ({productid: productid, secret: secret, store_id: store_id});
                API(req, body, '/cart/cart/', function (req, response, msg) {
                    if (msg == ERROR) {
                        res.json({status: 0, statuscode: ERR_STATUS, error: response});
                    } else if (req.statusCode == ERR_STATUS) {
                        res.json({status: 0, statuscode: req.statusCode, body: response});
                    } else {
                        res.json({status: 1, statuscode: req.statusCode, body: response});
                    }
                });
            }
        }
    });
});

module.exports = router;