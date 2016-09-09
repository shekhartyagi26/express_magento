var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
require('node-import');
imports('config/index');

var redis = require("redis"),
        client = redis.createClient();


router.post('/products', function (req, res) {
    var id = req.body.id;

    if (id > 0) {
        client.hgetall('category', function (err, object) {
            if (object.id == id) {
                console.log("exist");
                res.json(object);

            } else {
                console.log('doesnt exist');
                res.json('doesnt exist');
                request({
                    url: jsonData[1].url + '/category/products/', //URL to hit
                    method: 'post',
                    headers: jsonData[0],
                    body: JSON.stringify({
                        id: id
                    })

                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        res.json(error);
                    }
                    if (response.statusCode == 500) {
                        console.log("not found");
                        res.json({status: 0, error: response.statusCode, msg: "not found"});
                    } else {

                        client.hmset('category', {
                            'id': id,
                            "body": body
                        });
                        client.hgetall('category', function (err, object) {
                            console.log(object);
                        });
                        console.log(response.statusCode, body);
                        res.json({status: 1, statuscode: response.statusCode, body: body});
                    }
                });
            }
        });
    } else {
        res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields")
    }
});


module.exports = router;