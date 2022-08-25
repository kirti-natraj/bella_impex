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
var otpGenerator = require('otp-generator');
var otp_db = require('../models/otp');
const moment = require('moment');

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
router.post('/login',async function (req, res) {

    const otp = otpGenerator.generate(6, { digits:true, upperCaseAlphabets:false, specialChars: false, lowerCaseAlphabets:false});
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);

    const data = await user_db.findOne({mobile: req.body.mobile });
    console.log(data);
    if(data == null) 
    {
        res.json({ response: false , msg: "User not exist"});
      
    }
    else 
    {
        const geOtp = new otp_db({
            "otp": otp,
             "expiration_time": expiration_time,
             "mobile_no": req.body.mobile
         });
        res.json({response: true, msg:"OTP Sent Successfully!"})
    }
   
    
   
    


});


router.post('/checkUserExistApi',async function (req, res, next) {
    const data = await user_db.findOne({email: req.body.user_data });
    console.log(data);
    if(data == null) 
    {
        res.json({ response: false , msg: "User not exist"});
        const data = await user_db.findOne({user_name: req.body.user_data });
    }
  
    else if(data == null)
    {
        res.json({ response: false , msg: "User not exist"});
    }
    else res.json({response: true, msg:"User exist"})
});

router.post('/getUserDataApi',async function (req, res, next) {
    user_db.findById(req.body.user_id)
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not exist"});
        else {
            result.fcmToken = req.body.fcmToken;
            return res.json({response: true, msg:"User exist", data: result});
        }
    })
});

module.exports = router;