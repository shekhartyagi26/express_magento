var request = require('request');
require('node-import');
imports('config/index');
imports('config/constant');

exports.request = function (body, headers, url_, callback) {
    request({
        url: url_, //URL to hit
        method: 'post',
        headers: headers,
        timeout: 10000,
        body: JSON.stringify(body)
    }, function (error, result, body) {
        if (error) {
            callback(500, error, ERROR);
        } else if (result.statusCode == 500) {
            callback(result, body, NOTFOUND)
        } else {
            callback(result, body, SUCCESS);
        }
    });
}
exports.headerVerify = function (headers, verify, callback) {

    if (headers.length > 0) {
        verify.findOne({headers: headers}, function (error, user, body) {
            if (error) {
                callback(500, error, ERROR);
            }
            if (!user) {
                callback(user, body, NOTFOUND)
            }
            var url = JSON.parse(JSON.stringify(user)).URL;
            callback(headers, url, SUCCESS);

        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
} 