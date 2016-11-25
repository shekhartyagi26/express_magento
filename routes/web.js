require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/config', function (req, res) {
    isValidate(req, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/web/config', function (req, response, msg) {
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
});

router.post('/getAllowedCountries', function (req, res) {
    isValidate(req, {store_id: 'required',
        secret: 'optional'}, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/web/getAllowedCountries', function (req, response, msg) {
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
});

module.exports = router;