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
    var headers = req.headers.app_id;
    var dtabase = req.app;
    var promise = dtabase.findOne({APP_ID: headers}).exec();
    promise.then(function (verify) {
        verify.url = JSON.parse(JSON.stringify(verify)).URL;
        return verify.save(); // returns a promise
    })
            .then(function (verify) {
                var URL = verify.url;
                req.URL = URL;
                next();
            })
            .catch(function (err) {
                console.log(err);
                req.URL = "";
                next();
            });
}

