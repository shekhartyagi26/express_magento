var _underscore = require('underscore');

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

            if(myKey == 'entity_id'){
                result[myKey] = req.body[myKey];
            } else if (req.body[myKey]) {
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