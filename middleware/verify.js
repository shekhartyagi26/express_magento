var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var Schema = mongoose.Schema;
var verifySchema = new Schema({
    headers: String,
    url: String,
});
var dtabase = mongoose.model('dtabase', verifySchema);


module.exports = function (req, res, next) {
    var headers = "com.tethr";
    var dtabase = req.app;
    var promise = dtabase.findOne({APP_ID: headers}).exec();
    if (headers.length > 0) {
        promise.then(function (verify) {
            URL = verify.get('URL');
            req.URL = URL;
            next();
        })
                .catch(function (err) {
                    res.json({status: 0, statuscode: 500, body: "URL is not found in database"});
                });
    } else if (headers == undefined) {
        res.json({status: 0, statuscode: 500, body: "header is undefined"});
    } else {
        res.json({status: 0, statuscode: 500, body: "header cannot be empty"});
    }
}
