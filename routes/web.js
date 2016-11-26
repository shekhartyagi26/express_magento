require('node-import');
require('../service/validate');
require('../service/request');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/config', function (req, res) {
    validate(req, res, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        API(req, res, body, '/web/config', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: JSON.parse(response)});
        });
    });
});

router.post('/getAllowedCountries', function (req, res) {
    validate(req, res, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        API(req, res, body, '/web/getAllowedCountries', function (status, response, msg) {
            res.json({status: status, statuscode: msg, body: JSON.parse(response)});
        });
    });
});

module.exports = router;