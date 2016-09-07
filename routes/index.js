
var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res) {
	console.log("hello world");
  res.send('hello world');

});

module.exports = router;
