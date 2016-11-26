require('node-import');
imports('config/index');
imports('config/constant');
var request = require('request');

API = function (req, res, body, url, callback) {
    request({
        url: req.URL + url, //URL to hit
        method: 'post',
        headers: {APP_ID: req.headers.app_id, "Authorization": req.headers.authorization},
        timeout: 10000,
        body: JSON.stringify(body)
    }, function (error, result, body) {
        var allData = JSON.parse(body);
        if (error) {
//            callback(500, error, ERROR);
            res.json({status: 0, statuscode: error, body: ERROR});
        } else if (result.statusCode === 500) {
            res.json({status: 0, statuscode: NOTFOUND, body: allData.data});
        } else {
            var allData = JSON.parse(body);
            callback(1, allData.data, SUCCESS);
        }
    });
};