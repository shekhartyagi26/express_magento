var _underscore = require('underscore');

isAuth = function (req, callback) {
    callback(req.body.secret);
};

isValidate = function (req, schema, secret, callback) {
    var result = {};
    var allkeys = _underscore.keys(schema);
    for (var a = 0; a < allkeys.length; a++) {
        var myKey = allkeys[a];
        if (schema[myKey] != 'optional') {
            if (myKey == 'secret') {
                result[myKey] = secret;
            }
            if (req.body[myKey]) {
                result[myKey] = req.body[myKey];
            } else {
                callback(0);
            }
        }
    }
    callback(result);
};