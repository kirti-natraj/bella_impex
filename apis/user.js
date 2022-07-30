var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const moment = require('moment');


router.post('/login', function (req, res) {

    const user = user_db.findOne({
        'email': req.body.email,
        'password': req.body.password
    }, function (err, user) {
        if (!user) {
            return res.json({isAuth: false, message: ' Auth failed ,email not found'});
        }
        else
        {
            res.json({response: true, data: user})
               console.log("It matches!") 
        }
       
        // bcrypt.compare(req.body.password, user.password, (err, result) => {
        //     if (result) {
        //         user.fcmToken = req.body.fcmToken;
        //         res.json({response: true, data: user})
        //         console.log("It matches!")
        //     } else {
        //         res.json({response: false, postMessage:"Incorrect Password"})
        //         console.log("Invalid password!");
        //     }

        // });
    })


});
module.exports = router;