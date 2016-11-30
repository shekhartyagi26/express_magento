require('node-import');
imports('config/index');
imports('config/constant');
var express = require('express');
var router = express.Router();

router.post('/products', function (req, res) {
    homeProducts(req, res);
});

router.post('/categories', function (req, res) {
    homeCategories(req, res);
});

router.post('/slider', function (req, res) {
    homeSlider(req, res);
});

module.exports = router;