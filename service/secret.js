var _underscore = require('underscore');
var redis = require("redis"),
        client = redis.createClient();

isAuth = function (req, res, callback) {
    if (req.body.secret) {
        callback(req.body.secret);
    } else {
        res.json({status: 0, body: 'Secret Empty'});
    }
};

validate = function (req, res, schema, secret, callback) {
    var result = {};
    var allkeys = _underscore.keys(schema);
    var find = false;
    for (var a = 0; a < allkeys.length; a++) {
        var myKey = allkeys[a];
        if (schema[myKey] != 'optional') {
            if (myKey == 'secret') {
                result[myKey] = secret;
            }
            if (req.body[myKey]) {
                result[myKey] = req.body[myKey];
            } else {
                find = true;
                break;
            }
        }
    }
    if (find == true) {
        res.json({status: 0, body: 'Fill required fields!'});
    } else {
        callback(result);
    }
};

redisFetch = function (req, res, productType, value, id, callback) {
    var status = req.status;
    client.hgetall(productType + id, function (err, object) {
        if (err) {
            res.json({status: 0, body: err});
        } else {
            if (value == 1) {
                if (object !== null && object.id == id && status == "enabled") {
                    res.json(object);
                } else {
                    callback();
                }
            } else if (value == 2) {
                if (object != null && object.sku == id && status == 'enabled') {
                    res.json(object);
                } else {
                    callback();
                }
            } else if (value == 3) {
                if (object != null && object.type == id && status == "enabled") {
                    res.json(object);
                } else {
                    callback();
                }
            } else {
                if (object != null && status == 'enabled') {
                    res.json(object);
                } else {
                    callback();
                }
            }
        }
    });
};