require('node-import');
imports('config/index');
imports('config/constant');
var request = require('request');

API = function (req, body, url, callback) {
    request({
        url: req.URL + url, //URL to hit
        method: 'post',
        headers: {APP_ID: req.headers.app_id, "Authorization": req.headers.authorization},
        timeout: 10000,
        body: JSON.stringify(body)
    }, function (error, result, body) {
        if (error) {
            callback(0, error, ERROR);
        } else if (result.statusCode === 500) {
            callback(0, body, NOTFOUND);
        } else {
            callback(1, body, SUCCESS);
        }
    });
};