var express = require('express');
var router = express.Router();


// get an instance of the router for api routes
var express = require('express');
var jwt = require('jsonwebtoken');

// route middleware to decode a token
exports.headerVerify = function (headers, verify, callback) {
    var promise = verify.findOne({APP_ID: headers}).exec();
    promise.then(function (verify) {
        verify.url = JSON.parse(JSON.stringify(verify)).URL;
        return verify.save(); // returns a promise
    })
            .then(function (verify) {
                callback(headers, verify.url, SUCCESS);
            })
            .catch(function (err) {
                callback(headers, err, ERROR);
            });
}

module.exports = router;