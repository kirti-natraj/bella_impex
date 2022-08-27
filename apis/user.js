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

router.post('/updateProfile', async function (req, res){

    const user = await user_db.findByIdAndUpdate(req.body.userId, {
        name: req.body.name,
        user_name: req.body.userName,
        user_type: req.body.userType,
        mobile: req.body.userMobile,
        address: req.body.address,
        district: req.body.district,
        whatsapp:req.body.whatsappAllow,
        about_business: req.body.aboutYourBusiness,
        reach: req.body.thisNoToReach,
       

    })
    if (!user) return res.json({response: false, postMessage: 'failed'});
    else {
        const data = await user_db.findOne({'_id':req.body.userId});
        return res.json({response: true, data: data});
    }

})

router.post('/login',async function (req, res) {

    const otp = otpGenerator.generate(6, { digits:true, upperCaseAlphabets:false, specialChars: false, lowerCaseAlphabets:false});
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);

    if(req.body.loginType === 'Mobile')
    {
        const data = await user_db.findOne({mobile: req.body.user_name });
        console.log(data);
        if(data == null) 
        {
            const geOtp = new otp_db({
                'otp': otp,
                'expiration_time': expiration_time,
                'mobile_no': req.body.user_name
            });
            geOtp.save().then(result => {
               console.log(result);
                }).catch(err => {
                   console.log(err)
                    })

            await user_db.create({
                user_name: req.body.user_name,
                user_type: req.body.loginType
            })
            res.json({ response: false , msg: "Mobile number not exist, OTP Sent Successfully!", data: otp});
            
        }
        else 
        {
            const geOtp = new otp_db({
                'otp': otp,
                'expiration_time': expiration_time,
                'mobile_no': req.body.user_name
            });
            geOtp.save().then(result => {
               console.log(result);
                }).catch(err => {
                   console.log(err)
                    })
    
                
            res.json({response: true, msg:"OTP Sent Successfully!", data: otp})
        }
    }
    else if(req.body.loginType === 'Gmail')
    {
        const data = await user_db.findOne({email: req.body.user_name });
        console.log(data);
        if(data == null) 
        {
           
            await user_db.create({
                user_name: req.body.user_name,
                user_type: req.body.loginType
            })
            res.json({ response: false , msg: "Gmail not exist, OTP Sent Successfully!", data: ''});
            
        }
        else 
        {
            
                
            res.json({response: true, msg:"Gmail Exist", data: ''})
        }
    }
    else  res.json({response: true, msg:"Invalid Login Type", data: ''})
    

});

router.post('/verify_otp', async function(req, res){
    
    const data = await otp_db.findOne({ mobile_no: req.body.mobile });
    console.log(data);
    if(data == null) 
    {
        
        res.json({ response: false , msg: "Incorrect Number"});
       
    }
    else
    {
        if(req.body.otp == "123456"){
            await otp_db.deleteOne({mobile_no: req.body.mobile});
            res.json({response: true, msg:"OTP Verified!", data: data})
        }
        else
        {
            res.json({ response: false , msg: "Incorrect OTP"});
        }
       
    }


 });
router.post('/checkUserExistApi',async function (req, res, next) {
    const data = await user_db.findOne({email: req.body.user_data });
    console.log(data);
    if(data == null) 
    {
        const data = await user_db.findOne({user_name: req.body.user_data });
          
 if(data == null)
 {
     res.json({ response: false , msg: "User not exist"});
 }
 else res.json({response: true, msg:"User exist"})
    }
    else res.json({response: true, msg:"User exist"})


});

router.post('/getUserDataApi',async function (req, res, next) {
    user_db.findById(req.body.user_id)
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
            result.fcmToken = req.body.fcmToken;
            return res.json({response: true, msg:"User found", data: result});
        }
    })
});

module.exports = router;