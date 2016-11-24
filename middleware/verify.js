var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = function (req, res, next) {
    var headers = req.headers.app_id;
    var dtabase = req.app;
    var promise = dtabase.findOne({
        APP_ID: headers
    }).exec();
    if (headers.length > 0) {
        promise.then(function (verify) {
            URL = verify.get('URL');
            req.URL = URL;
            next();
        }).catch(function (err) {
            res.json({status: 0, statuscode: 500, body: "URL is not found in database"});
        });
    } else if (headers == undefined) {
        res.json({status: 0, statuscode: 500, body: "header is undefined"});
    } else {
        res.json({status: 0, statuscode: 500, body: "header cannot be empty"});
    }
};