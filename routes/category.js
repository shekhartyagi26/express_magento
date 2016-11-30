require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.all('/products', function (req, res) {
    categoryProducts(req, res);
});

router.all('/categorylist', function (req, res) {
    categoryCategoryList(req, res);
});

module.exports = router;