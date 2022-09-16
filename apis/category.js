var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var banner_db= require('../models/banner');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');

const moment = require('moment');var express = require('express');

router.get('/',async function (req, res, next) {
    const data = await category_db.find().exec();
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
        
        res.json({ response: true , msg: "Data Found", data: data });
    } 

 
});

router.post('/subcategory',async function (req, res, next) {
    const cat_id =  req.body.category_id;
    console.log(cat_id)
    const data = await subcategory_db.find({category_id: cat_id});
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
        console.log(data)
        res.json({ response: true , msg: "Data Found", data: data });
    } 
});
 router.get('/getBanner', async function(req, res, next){
     const data = await banner_db.find().select('image');
     const totalUserCount = await user_db.count(); 
     if(data == '') 
     {
        
         return res.json({response: false, msg:"Data not found", totalUserCount :totalUserCount , data: data })
     }    
     else
     {
         console.log(data)
         res.json({ response: true , msg: "Data Found", totalUserCount :totalUserCount, data: data});
     } 
 });
module.exports = router;