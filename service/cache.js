var redis = require("redis"),
        client = redis.createClient();

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