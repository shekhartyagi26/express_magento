require('node-import');
require('../service/validate');
require('../service/image');
require('../service/request');
require('../service/cache');
require('../service/responseMsg');
require('../service/productAPIs');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/get', function (req, res) {
    productGet(req, res);
});

router.post('/review', function (req, res) {
    productReview(req, res);
});

router.post('/getrating', function (req, res) {
    productGetRating(req, res);
});

router.post('/submitreview', function (req, res) {
    validate(req, res, {sku: 'required',
        store_id: 'required',
        title: 'required',
        details: 'required',
        nickname: 'required',
        rating_options: 'required',
        secret: 'optional'}, null, function (body) {
        if (req.headers.app_id && req.URL) {
            API(req, res, body, '/product/submitreview/', function (status, response, msg) {
                success(res, status, response);
            });
        } else {
            success(res, 0, INVALID);
        }
    });
});

module.exports = router;