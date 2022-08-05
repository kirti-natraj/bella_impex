var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('web_page/index');

});

router.get('/price', function (req, res) {
    res.render('web_page/price');

});

router.get('/location', function (req, res) {
    res.render('web_page/location');

});

module.exports = router;