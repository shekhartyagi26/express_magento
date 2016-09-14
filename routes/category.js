var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var  cors = require('cors');
require('node-import');
imports('config/index');

var redis = require("redis"),
        client = redis.createClient();

router.all('/products', function (req, res) {
    
    var id = req.body.id;
    if (id > 0) {
        client.hgetall('category_'+id, function (err, object) {
            if (object!= null && object.id == id ) {
                console.log("exist");
                console.log(object.id);
                 res.json({msg: "exist", statuscode: "200", data: object});

            } else  {
                request({
                    url: config.url + '/category/products/', //URL to hit
                    method: 'post',
                    headers: {APP_ID:config.APP_ID},
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

                        client.hmset('category_'+id, {
                            'id': id,
                            "body": body
                        });
                       
                        console.log("doesnt exist");
                        console.log(response.statusCode, body);
                        res.json({msg: "doesnt exist", statuscode: response.statusCode, body: body});
                        client.expire('category_' + id, config.category_expiresAt);
                    }
                });
            }
        });
    } else {
         res.json({status: 0, error: "500", msg: "Invalid Fields"});
        console.log("Invalid Fields");
    }
});


module.exports = router;
