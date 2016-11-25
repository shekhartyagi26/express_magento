require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/login', function (req, res) {
    var schema = {countryid: 'optional', zip: 'optional', city: 'optional', telephone: 'optional',
        fax: 'optional', company: 'optional', street: 'optional', firstname: 'optional', lastname: 'optional',
        password: 'required', newPassword: 'optional', secret: 'optional', entity_id: 'optional',
        productid: 'optional', store_id: 'optional', parent_id: 'optional', type: 'optional',
        website_id: 'required', email: 'required'};
    isValidate(req, schema, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/customer/login/', function (req, response, msg) {
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

router.post('/register', function (req, res) {
    var schema = {countryid: 'optional', zip: 'optional', city: 'optional', telephone: 'optional',
        fax: 'optional', company: 'optional', street: 'optional', firstname: 'required', lastname: 'required',
        password: 'required', newPassword: 'optional', secret: 'optional', entity_id: 'optional',
        productid: 'optional', store_id: 'optional', parent_id: 'optional', type: 'optional',
        website_id: 'required', email: 'required'};
    isValidate(req, schema, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/customer/register/', function (req, response, msg) {
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

router.post('/forgot', function (req, res) {
    var schema = {countryid: 'optional', zip: 'optional', city: 'optional', telephone: 'optional',
        fax: 'optional', company: 'optional', street: 'optional', firstname: 'optional', lastname: 'optional',
        password: 'optional', newPassword: 'optional', secret: 'optional', entity_id: 'optional',
        productid: 'optional', store_id: 'optional', parent_id: 'optional', type: 'optional',
        website_id: 'required', email: 'required'};
    isValidate(req, schema, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/customer/forgot/', function (req, response, msg) {
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

router.post('/social_account', function (req, res) {
    var schema = {countryid: 'optional', zip: 'optional', city: 'optional', telephone: 'optional',
        fax: 'optional', company: 'optional', street: 'optional', firstname: 'required', lastname: 'required',
        password: 'optional', newPassword: 'optional', secret: 'optional', entity_id: 'optional',
        productid: 'optional', store_id: 'optional', parent_id: 'optional', type: 'optional',
        website_id: 'required', email: 'required', social: 'required', social_id: 'required'};
    isValidate(req, schema, null, function (body) {
        if (body == 0) {
            res.json({status: 0, body: 'Secret Empty'});
        } else {
            API(req, body, '/customer/social_account/', function (req, response, msg) {
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