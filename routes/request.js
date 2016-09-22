var request = require('request');
require('node-import');
imports('config/index');


exports.login = function (email, password, callback) {

    request({
        url: config.url + '/customer/login/', //URL to hit
        method: 'post',
        headers: {APP_ID: config.APP_ID},
        timeout: 10000,
        body: JSON.stringify({
            email: email,
            password: password
        })

    }, function (error, result, body) {
        if (error) {
            console.log(error);
            callback(null, body, error);
        } else if (result.statusCode == 500) {
            console.log("not found");
            callback(null, body, notfound)
        } else {
            callback(null, body, 'successfully');

        }
    });
} 