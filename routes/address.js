var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
require('node-import');
imports('config/index');
imports('config/constant');
const request_ = require('../service/request');

router.post('/edit', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var countryid = req.body.countryid;
    var zip = req.body.zip;
    var city = req.body.city;
    var telephone = req.body.telephone;
    var fax = req.body.fax;
    var company = req.body.company;
    var street = req.body.street;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var entity_id = req.body.entity_id;
    var URL = req.URL;
    var APP_ID = req.headers.app_id;
    if (countryid == UNDEFINE && zip == UNDEFINE && street == UNDEFINE && access_token == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (APP_ID.length > 0 && URL.length > 0) {
        var body = ({countryid: countryid, zip: zip, city: city, telephone: telephone, fax: fax, company: company, street: street, firstname: firstname, lastname: lastname, secret: secret, entity_id: entity_id});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
        var url = URL + '/address/edit/';
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
        res.json({status: 0, error: ERR_STATUS, body: INVALID});
    }
});

router.post('/delete', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var entity_id = req.body.entity_id;
    var URL = req.URL;
    var APP_ID = req.headers.app_id;
    if (entity_id == UNDEFINE) {
        res.json({status: 0, msg: UNDEFINE});
    } else if (APP_ID.length > 0 && URL.length > 0) {
        var body = ({secret: secret, entity_id: entity_id});
        var headers = {APP_ID: APP_ID, "Authorization": access_token};
        var url = URL + '/address/delete/';
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
        res.json({status: 0, error: ERR_STATUS, body: INVALID});
    }
});

module.exports = router;