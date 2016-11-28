require('node-import');
require('../service/validate');
require('../service/request');
require('../service/responseMsg');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/config', function (req, res) {
    validate(req, res, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        API(req, res, body, '/web/config', function (status, response, msg) {
            success(res, status, response);
        });
    });
});

router.post('/getAllowedCountries', function (req, res) {
    validate(req, res, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        API(req, res, body, '/web/getAllowedCountries', function (status, response, msg) {
            success(res, status, response);
        });
    });
});

module.exports = router;