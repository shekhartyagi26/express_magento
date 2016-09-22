var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cors = require('cors');
var bodyParser = require('body-parser');
require('node-import');
imports('config/index');

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
        request({
            url: config.url + '/address/edit  ', //URL to hit
            method: 'post',
            headers: {APP_ID: config.APP_ID, "Authorization": access_token},
            timeout: 10000,
            body: JSON.stringify({
                countryid: countryid,
                zip: zip,
                city: city,
                teliphone: teliphone,
                fax: fax,
                company: company,
                street: street,
                firstname: firstname,
                lastname: lastname,
                secret: secret
            })

        }, function (error, result, body) {
            if (error) {
                console.log(error);
                res.json({status: 0, error: error});
            } else if (result.statusCode == 500) {
                console.log("not found");
                res.json({status: 0, error: result.statusCode, msg: "not found", body: body});
            } else {
                console.log(result.statusCode, body);
                res.json({status: 1, statuscode: result.statusCode, body: body});
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
    }
});

module.exports = router;