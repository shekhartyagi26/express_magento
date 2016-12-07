imports('config/index');
var express = require('express');
var router = express.Router();
var gcm = require('node-gcm');
console.log(config.GOOGLE_API_KEY)

router.post('/add', function (req, res) {
    var add_gsm = req.Collection_gsm;
    var gsm_id = req.body.gsm_id;
    var record = new add_gsm({
        gsm_id: gsm_id,
    });
    if (gsm_id.length > 0) {
        record.save(function (err, result) {
            if (err) {
                res.json({status: 0, message: err})
            } else {
                res.json({status: 1, gsm_id: gsm_id, message: " success"});
            }
        })
    } else {
        res.json({status: 0, msg: "Invalid Fields"});
    }
});

router.post('/pushmessage',function(req,res){

var sender = new gcm.Sender(config.GOOGLE_API_KEY);

// Prepare a message to be sent
var message = new gcm.Message({
    data: { key1: 'msg1' }
});

// Specify which registration IDs to deliver the message to
var regTokens = ['YOUR_REG_TOKEN_HERE'];

// Actually send the message
sender.send(message, { registrationTokens: regTokens }, function (err, response) {
    if (err) console.error(err);
    else console.log(response);
});

});

module.exports = router;