var express = require('express');
var router = express.Router();
var fs = require('fs');
var FCM = require('fcm-node');
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var user_bill_db = require('../models/user_billing');
var invoice_db = require('../models/invoice');
var product_db = require('../models/products');
var otpGenerator = require('otp-generator');
var otp_db = require('../models/otp');
const noti_db = require('../models/noti');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const banner_db = require('../models/banner');
const state_db = require('../models/state');
const city_db = require('../models/city');
////

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
///
const moment = require('moment');
const { ResultStorage } = require('firebase-functions/v1/testLab');


function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

/////////////////////////mongogrid
const mongoURI = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });

// //////////////////////////////////

router.post('/upload', upload.single('image'), async(req, res) => {
    // res.json({ file: req.file });
    console.log(req.file.filename);
    var user = await user_db.findByIdAndUpdate(req.body.userId, {
           
               image: req.file.filename
                   
              })
    return res.json({response: true, data: user});
  });

//     router.post('/updateProfileImage', uploadUser.fields([{name:'image', maxCount: 1}]), async function (req, res){
//     console.log(req.files.image);
    
//         var user = await user_db.findByIdAndUpdate(req.body.userId, {
           
//             image: req.files.image[0].filename,
           
//         })
    
//     if (!user) return res.json({response: false, postMessage: 'failed'});
//     else {
//         const data = await user_db.findOne({'_id':req.body.userId});
//         return res.json({response: true, data: data});
//     }

// })

    router.post('/updateProfile',  async function (req, res){
    
   
        var user = await user_db.findByIdAndUpdate(req.body.userId, {
            name: req.body.name,
            email: req.body.userEmail,
            mobile: req.body.userMobile,
            address: req.body.address,
            stateId: req.body.stateId,
            cityId: req.body.cityId,
            stateName: req.body.stateName,
            cityName: req.body.CityName,
            whatsapp:req.body.whatsappAllow,
            about_business: req.body.aboutYourBusiness,
            toThisNoReach: req.body.thisNoToReach,
        })
    
        const data = await user_db.findOne({'_id':req.body.userId});
        return res.json({response: true, data: data});


})

router.post('/login',async function (req, res) {

    const otp = otpGenerator.generate(6, { digits:true, upperCaseAlphabets:false, specialChars: false, lowerCaseAlphabets:false});
    const now = new Date();
    const expiration_time = AddMinutesToDate(now,10);

    if(req.body.loginType === 'Mobile')
    {
        const data = await user_db.findOne({user_name: req.body.user_name });
        console.log(data);
        if(data == null) 
        {
             new otp_db({
                'otp': otp,
                'expiration_time': expiration_time,
                'mobile_no': req.body.user_name
            });
            
            const user_data = await user_db.create({
                user_name: req.body.user_name,
                user_type: req.body.loginType
            })
            data.fcmToken = req.body.fcmToken;
            res.json({ response: false , msg: "Mobile number not exist, OTP Sent Successfully!", data: otp, user_id: user_data._id, fcmToken: user_data.fcmToken});
            
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
    
                data.fcmToken = req.body.fcmToken;
            res.json({response: true, msg:"OTP Sent Successfully!", data: otp, user_id: data._id, fcmToken: data.fcmToken})
        }
    }

    else if(req.body.loginType === 'Gmail')
     {
        const data = await user_db.findOne({user_name: req.body.user_name });
        console.log(data);
        if(data == null) 
        {
           
           const user_data = await user_db.create({
                user_name: req.body.user_name,
                user_type: req.body.loginType
            })
            user_data.fcmToken = req.body.fcmToken;
            res.json({ response: false , msg: "Gmail not exist, OTP Sent Successfully!", data: '', user_id: user_data._id, fcmToken: user_data.fcmToken});
            
        }
        else 
        {
            
            data.fcmToken = req.body.fcmToken;    
            res.json({response: true, msg:"Gmail Exist", data: '', user_id: data._id, fcmToken: data.fcmToken})
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
            await otp_db.deleteOne({user_name: req.body.mobile});
            user_db.findOne({user_name: req.body.mobile})
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
            result.fcmToken = req.body.fcmToken;
            return res.json({response: true, msg:"OTP verified!", data: result});
        }
    })
          
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
 else res.json({response: true, msg:"User exist", data: data})
    }
    else res.json({response: true, msg:"User exist"})


});

router.post('/getUserDataApi',async function (req, res, next) {
   
         await user_db.findByIdAndUpdate(req.body.user_id,{
                fcmToken:  req.body.fcmToken
            });
            const data = await user_db.findById(req.body.user_id);
            return res.json({response: true, msg:"User found", data: data});
     

});

router.post('/getLike', async function (req, res, next){
    const data = await user_db.findById(req.body.user_id);
    const user = await vehicle_db.find({_id: {$in: data.liked_post_id}}).exec();
      return res.json({response: true, msg:"Liked by user", data: user});
      
});

router.post('/likeIncr', async function (req, res, next){

    const user = req.body.user_id;
    const user_data = await user_db.findById(user);
    var flag = false;
    console.log(user_data);
   
       for(var i=0;i < user_data.liked_post_id.length ;i++){
          
           if(user_data.liked_post_id[i] == req.body.post_id ){

            flag = true;
             await user_db.findByIdAndUpdate(req.body.user_id, {
       
    $pull:{
      liked_post_id: req.body.post_id
    }

    });

    await vehicle_db.findByIdAndUpdate(req.body.post_id,{
       
     $inc:{
       like_count: -1
     } 

    });
    const data = await vehicle_db.findById(req.body.post_id);
        return res.json({response: true, msg:"Unliked by user", data: data});
       
           }
       }
   if(flag == false){
    await user_db.findByIdAndUpdate(req.body.user_id, {
         
        $push:{
          liked_post_id: req.body.post_id
        }
  
        });
  
        await vehicle_db.findByIdAndUpdate(req.body.post_id,{
           
         $inc:{
           like_count: 1
         } 
  
        });
        
        const data = await vehicle_db.findById(req.body.post_id);
          return res.json({response: true, msg:"Liked by user"});
   }


    
        
});

// router.post('/likeDecr', async function (req, res, next){
//     await user_db.findByIdAndUpdate(req.body.user_id, {
       
//     $pull:{
//       liked_post_id: req.body.post_id
//     }

//     });

//     await vehicle_db.findByIdAndUpdate(req.body.post_id,{
       
//      $inc:{
//        like_count: -1
//      } 

//     });
//     const data = await vehicle_db.findById(req.body.post_id);
//         return res.json({response: true, msg:"Unliked by user", data: data});
       
   
// });
////notification
router.post('/getNotification',async function (req, res, next) {

    user_db.findById(req.body.user_id)
    .then(result => {
        if (!result) 
        {
            return res.json({response: false, msg: "Data not found"});
        }else {
          
            return res.json({response: true, msg:"Data found", data: result.notification});
        }
    })
});
router.post('/deleteAllNotification',async function (req, res, next) {
  
           await user_db.findByIdAndUpdate(req.body.user_id, {$set: {notification: [] }});
          const data = await user_db.findById(req.body.user_id);
            return res.json({response: true, msg:"All notification deleted...", data: data.notification});
      
});
router.post('/deleteNotification',async function (req, res, next) {
  
   await user_db.findByIdAndUpdate(req.body.user_id,{ 
    $pull:{
        notification:{
          product_id: req.body.product_id
          
        }
      }
    })
   
    const data = await user_db.findById(req.body.user_id);
    return res.json({response: true, msg:"Notification deleted...", data: data.notification});

});


/////////////////////billing

router.get('/:id', async function (req, res) {
    const data = await user_bill_db.find({user_id:req.params.id});
    const invoice = await invoice_db.create({
        user_id: req.params.id,
        created_on: moment(Date.now()).format("YYYY-MM-DD"),
    });
    console.log(invoice);
    res.render('web_page/invoice', {data: data, invoice: invoice});
});



router.post('/customerBillingInformation',async function (req, res, next) {
    user_bill_db.find({user_id:req.body.user_id})
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
           

            return res.json({response: true, msg:"User found", data: result});
        }
    })
});

router.post('/setCustomerBillingInformation',async function (req, res, next) {
    const user_data = await user_bill_db.create({
        user_id: req.body.user_id,
        name: req.body.name,
        address: req.body.address,
        stateName: req.body.state,
        cityName: req.body.city,
        gst: req.body.gst,
        gstNo: req.body.gstNo
    });

    return res.json({response: true, msg:"Data found", data: user_data });

});

router.post('/sendNotification',async function (req, res, next) {
    const data = req.body;
   await Notification.add({ data });
    res.send({ msg: "User Added" });
});


router.get('/generateToken',async function (req, res, next) {
    firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
.then(function () {
     firebase.auth().currentUser.getIdToken(true).then(function          (idToken){
            res.send(idToken)
            res.end()
         }).catch(function (error) {
             //Handle error
         });
}).catch(function (error) {
      //Handle error
});
});

router.post('/senFCMNoti', async function(req,res,next){
  
    var serverKey = 'key=AAAAP6Bdr-Y:APA91bEAKk8D9UpPF5O4KHZR9WkbW5sfaJL7hOF3Yjpb7cHADxrG4cteVRbjbizcMk0V2uJNCeuqdGut00lncrzv3HDTv8j2Fdj4AhrL-XvvUsHSCsyEQqXFJsQID_t-cMBTMfA3oB71';
    var fcm = new FCM(serverKey);
    
    var message = {
    "to":"dvTxmeoi5Sw:APA91bEEcXu8v1YFldcUtE7iUvba4m5knANvD6CG9f1xS8MjBLiAM7aM_JpEIQSQcpHlU1Vd8lBD_VlRGfSlsZFub_XrboCFFRktLYFWsD3zWs8hgCAoWgg4kwZyzrtykEiNQU1mTSio",
        "notification": {
           "title": "NotifcatioTestAPP",
            "body": "Message from node js app",
        },
    
    };
    
    fcm.send(message, function(err, response) {
        if (err) {
            console.log("Something has gone wrong!"+err);
            console.log("Respponse:! "+response);
        } else {
            // showToast("Successfully sent with response");
            console.log("Successfully sent with response: ", response);
          
        }
    
    });
   
});

router.get('/deleteAll/:id', async function (req, res) {
    const data = await upload.deleteMany();
    

    res.json( {msg:'deleted'});
});

module.exports = router;