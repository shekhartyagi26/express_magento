var redis = require("redis"),
        client = redis.createClient();

redisFetch = function (req, res, productType, id, type, callback) {
    var status = req.status;
    client.hgetall(productType + id, function (err, object) {
        if (err) {
            res.json({status: 0, body: err});
        } else {
            if (id) {
                if (object !== null && object.id == id && status == "enabled") {
                    res.json(object);
                } else {
                    callback();
                }
            } else if (!id && type) {
                if (object != null && object.type == type && status == "enabled") {
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

redisSet = function (catType, id, limit, optmized_response, type, callback) {
    client.hmset(catType + id, {
        'id': id,
        "limit": limit,
        "body": optmized_response,
        "type": type
    });
    if (id) {
        client.expire(catType + id, config.CATEGORY_EXPIRESAT);
    } else if (!id && type) {
        client.expire(catType + type, config.CATEGORY_EXPIRESAT);
    } else {
        client.expire(catType, config.CATEGORY_EXPIRESAT);
    }
    callback();
};