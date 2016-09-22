var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
require('node-import');
imports('config/index');
const request_ = require('./request');
router.post('/edit', function (req, res) {
    var access_token = req.headers.authorization;
    var secret = req.body.secret;
    var countryid = req.body.countryid;
    var zip = req.body.zip;
    var city = req.body.city;
    var teliphone = req.body.teliphone;
    var fax = req.body.fax;
    var company = req.body.company;
    var street = req.body.street;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    if (countryid == undefined && zip == undefined && street == undefined && access_token == undefined) {
        console.log("undefined ");
        res.json({status: 0, msg: "undefined "});
    } else if (countryid.length > 0 && zip.length > 0 && street.length > 0 && access_token.length > 0) {
        var body = ({countryid: countryid, zip: zip, city: city, teliphone: teliphone, fax: fax, company: company, street: street, firstname: firstname, lastname: lastname, secret: secret});
        var headers = {APP_ID: config.APP_ID, "Authorization": access_token};
        var url = '/address/edit/';
        request_.request(body, headers, url, function (req, response) {
            res.json({status: 1, statuscode: req.statusCode, body: response});
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});

module.exports = router;