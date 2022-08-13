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
const moment = require('moment');var express = require('express');

router.get('/',async function (req, res, next) {
    const data = await category_db.find().exec();
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found"})
    }    
    else
    {
        
        res.json({ response: true , msg: "Data Found", data: data });
    } 

 
});

router.post('/subcategory',async function (req, res, next) {
    const data = await subcategory_db.find({category_id: req.body.category_id});
    if(data == '') return res.json({response: false, msg:"Data not found"})
    else res.json({ response: true , msg: "Data Found",data: data });
});

module.exports = router;