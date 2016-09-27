var express = require('express');
var app = express();

module.exports = function (req, res, next) {
    var headers = "com.tethr";
    var verify = req.Collection;
    var promise = verify.findOne({APP_ID: headers}).exec();
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
                console.log(err)
                next();
            });
}

