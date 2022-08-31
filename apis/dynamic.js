
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {
    
    res.render('web_page/form_field');

});

module.exports = router;