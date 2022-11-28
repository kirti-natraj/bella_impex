var express = require('express');
var router = express.Router();
var fs = require('fs');
var FCM = require('fcm-node');
var schedule = require('node-schedule');
var user_db = require('../models/user');
var vehicle_db= require('../models/vehicle');
var user_bill_db = require('../models/user_billing');
var invoice_db = require('../models/invoice');
var product_db = require('../models/products');
const admin_invoice = require('../models/adminInvoice');
var otpGenerator = require('otp-generator');
var otp_db = require('../models/otp');
const feed_db = require('../models/feed');
var page_db = require('../models/page');
var group_db = require('../models/group');
const follow_db = require('../models/follow');
const followGroup_db = require('../models/followGroup');
const followPage_db = require('../models/followPage');
const block_db = require('../models/block');
const suggestion_db = require('../models/suggestionFriends');
const likePost_db = require('../models/likePost');
const package_db = require('../models/subscription');
const feedStory_db = require('../models/feedStory');
const likePostComment_db = require('../models/likeComment');
const commentPost_db = require('../models/comment');
const activity_db = require('../models/activity');
const savePost_db = require('../models/savePost');
const reels_db = require('../models/reels');
///// mongodb
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const moment = require('moment');
const { ResultStorage } = require('firebase-functions/v1/testLab');
const feedStory = require('../models/feedStory');
const follow = require('../models/follow');
////////////////////////////////////////////////mongodb
// Mongo URI
const mongoURI = 'mongodb+srv://belle-impex:belle123@serverlessinstance0.wn38x.mongodb.net/?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs, gridfsBucket;
conn.once('open', () => {
 gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
 bucketName: 'uploads'
});

 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads');
})

// Create storage engine
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
          contentType: 'image/jpeg',
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}


////////////////////////////////////

    router.post('/updateProfileImage', upload.single('image'), async function (req, res){
    
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
        var user = await user_db.findByIdAndUpdate(req.body.userId, {
           
            image: baseUrl + req.file.filename,
           
        })
    
    if (!user) return res.json({response: false, postMessage: 'failed'});
    else {
        const data = await user_db.findOne({'_id':req.body.userId});
        return res.json({response: true, data: data});
    }

})

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
                user_type: req.body.loginType,
                added_on: moment(Date.now()).format("MMM Do YY"),
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
                user_type: req.body.loginType,
                added_on: moment(Date.now()).format("MMM Do YYYY"),
            })
            user_data.fcmToken = req.body.fcmToken;
            res.json({ response: false , msg: "Gmail not exist, User Created Successfully!", data: '', user_id: user_data._id, fcmToken: user_data.fcmToken});
            
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
    const user = await product_db.find({_id: {$in: data.liked_post_id}}).exec();
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

    await product_db.findByIdAndUpdate(req.body.post_id,{
       
     $inc:{
       like_count: -1
     } 

    });
    const data = await product_db.findById(req.body.post_id);
        return res.json({response: true, msg:"Unliked by user", data: data});
       
           }
       }
   if(flag == false){
    await user_db.findByIdAndUpdate(req.body.user_id, {
         
        $push:{
          liked_post_id: req.body.post_id
        }
  
        });
  
        await product_db.findByIdAndUpdate(req.body.post_id,{
           
         $inc:{
           like_count: 1
         } 
  
        });
        
        const data = await product_db.findById(req.body.post_id);
          return res.json({response: true, msg:"Liked by user"});
   }


    
        
});

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

router.get('/:id/:packageId/:invoice', async function (req, res){
    const data = await user_bill_db.findOne({user_id:req.params.id});
    const user = await user_db.findById(req.params.id);
    const company = await admin_invoice.find().exec();
    console.log(company);
    const number = otpGenerator.generate(6, { digits:true, upperCaseAlphabets:false, specialChars: false, lowerCaseAlphabets:false});
    const package = await package_db.findById(req.params.packageId);
    const invoice_data = await invoice_db.findOne({number:req.params.invoice});
    console.log(invoice_data)
    if(data == ''){
        return res.json({response: false, msg:"Billing info not added found"});
    }else{
    res.render('web_page/invoice',{data:data, invoice:invoice_data, user:user, package: package, company: company});
    }
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
    const user_data = await user_bill_db.findOne({user_id: req.body.user_id});
    if(user_data == ''){
        return res.json({response: false, msg:"Data Already found", data: user_data });
    }else{
        const data = await user_bill_db.create({
            user_id: req.body.user_id,
            name: req.body.name,
            address: req.body.address,
            stateName: req.body.state,
            cityName: req.body.city,
            gst: req.body.gst,
            gstNo: req.body.gstNo
        });
    
        return res.json({response: true, msg:"Successfully Submitted..", data: data });
    }
    

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


/////////////////add feed post

router.post('/addActivity', async function(req,res){
    const data = await activity_db.create({
        name: req.body.name,
        image: 'https://belle-impex-360513.el.r.appspot.com/assets/images/emoji/'+req.body.image,
        type: req.body.type
    });
  
    return res.json({response: true, msg:"Data found", data: data})
})
router.post('/getFeelingActivity', async function(req,res){
    const data = await activity_db.find({type: req.body.type});
    return res.json({response: true, msg:"Data found", data: data})
})

router.post('/addPostFeed',upload.single('url'), async function (req, res, next) {
    console.log(req.file);
      if(req.body.added_by == "" || req.body.userId == "" || req.body.from == "" &&(req.body.about ="" || req.body.location == "" || req.file == undefined || req.body.activityName == "")){
        res.json( {response: false, msg: 'Please insert Mandatory Fields!!!'});
       }else if(req.file == undefined){
        var activityVar = { 
            icon: req.body.icon,
            name: req.body.activityName,
            };

            let user;
           if(req.body.from == 'page'){
            user = await page_db.findOne({'_id': req.body.userId});
            console.log(user);
            let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
           const user_data = await feed_db.create({
               user_id: req.body.userId,
               added_by: req.body.added_by,
               userName: user.pageName,
               userImage: user.profileImage,
               type: req.body.type,
               from: req.body.from,
               ago: 'just now',
               location: req.body.location,
               activity: activityVar,
               about: req.body.about,
               added_on:moment(Date.now()).format("MMM Do YYYY"),
                     });
       
           res.json( {response: true, data: user_data});
           }else if(req.body.from == 'group'){
            user = await group_db.findOne({'_id': req.body.userId});
            let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
           const user_data = await feed_db.create({
               user_id: req.body.userId,
               added_by: req.body.added_by,
               userName: user.groupName,
               userImage: user.profileImage,
               type: req.body.type,
               from: req.body.from,
               ago: 'just now',
               location: req.body.location,
               activity: activityVar,
               about: req.body.about,
               added_on:moment(Date.now()).format("MMM Do YYYY"),
                     });
       
           res.json( {response: true, data: user_data});
           }else{ 
            user = await user_db.findOne({'_id': req.body.userId});
           let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
           const user_data = await feed_db.create({
               user_id: req.body.userId,
               added_by: req.body.added_by,
               userName: user.name,
               userImage: user.image,
               type: req.body.type,
               from: req.body.from,
               ago: 'just now',
               location: req.body.location,
               activity: activityVar,
               about: req.body.about,
               added_on:moment(Date.now()).format("MMM Do YYYY"),
                     });
       
           res.json( {response: true, data: user_data});
           }
            
            
               
        
      } else{
            var activityVar = { 
                icon: req.body.icon,
                name: req.body.activityName,
                };
                let user;
                if(req.body.from == 'page'){
                user = await page_db.findOne({'_id': req.body.userId});
                 let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
                 const user_data = await feed_db.create({
                     user_id: req.body.userId,
                     added_by: req.body.added_by,
                     userName: user.pageName,
                     userImage: user.profileImage,
                     type: req.body.type,
                     url: baseUrl + req.file.filename,
                     from: 'user',
                     ago: 'just now',
                     location: req.body.location,
                     activity: activityVar,
                     about: req.body.about,
                     added_on:moment(Date.now()).format("MMM Do YYYY"),
                           });
             
                 res.json( {response: true, data: user_data});
                }else if(req.body.from == 'group'){
                 user = await group_db.findOne({'_id': req.body.userId});
                 let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
                 const user_data = await feed_db.create({
                     user_id: req.body.userId,
                     added_by: req.body.added_by,
                     userName: user.groupName,
                     userImage: user.profilrImage,
                     type: req.body.type,
                     url: baseUrl + req.file.filename,
                     from: 'user',
                     ago: 'just now',
                     location: req.body.location,
                     activity: activityVar,
                     about: req.body.about,
                     added_on:moment(Date.now()).format("MMM Do YYYY"),
                           });
             
                 res.json( {response: true, data: user_data});
                }else{
                 user = await user_db.findOne({'_id': req.body.userId});
                let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
                const user_data = await feed_db.create({
                    user_id: req.body.userId,
                    added_by: req.body.added_by,
                    userName: user.name,
                    userImage: user.image,
                    type: req.body.type,
                    url: baseUrl + req.file.filename,
                    from: 'user',
                    ago: 'just now',
                    location: req.body.location,
                    activity: activityVar,
                    about: req.body.about,
                    added_on:moment(Date.now()).format("MMM Do YYYY"),
                          });
            
                res.json( {response: true, data: user_data});
                }
             
                  
              
        }
       
});

var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 0);

schedule.scheduleJob(rule,async function(){
    const data = await feedStory_db.find().exec();
    if(data ==''){
        console.log('No story');
    }else{
        await feedStory_db.updateMany({
            $inc:{created_on: 1}
      });
      console.log(feed_data);
      const user_data = await feedStory_db.find().exec();
        for(var i=0;i<user_data.length;i++){
            console.log(user_data[i].created_on/60);
        if(user_data[i].created_on%60 == 0){
            await feedStory_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on/60 + ' hr'
        });
        }else if(user_data[i].created_on <= 59){
            await feedStory_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on + ' min'
        });
        }
        if(user_data[i].created_on >= 1440){
            await feedStory_db.deleteOne({'_id':user_data[i]._id});
            console.log('Deleted');
        }
        }
        console.log(rule);
        console.log('Today is recognized by Rebecca Black!---------------------------');
    }
    
});

schedule.scheduleJob(rule,async function(){
    const data = await feed_db.find().exec();
    if(data ==''){
        console.log('No Post');
        
    }else{
        await feed_db.updateMany({
            $inc:{created_on: 1}
      });
      const user_data = await feed_db.find().exec();
        for(var i=0;i<user_data.length;i++){
        if(user_data[i].created_on%60 == 0){
            await feed_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on/60 + ' hr'
        });
        }else if(user_data[i].created_on <= 59){
            await feed_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on + ' min'
        });
        }else if(user_data[i].created_on >= 1440){
        await feed_db.findOneAndUpdate({'_id':user_data[i]._id},{
            ago: 1 + ' Day'
       });
       }else if(user_data[i].created_on >= 2880){
        await feed_db.findOneAndUpdate({'_id':user_data[i]._id},{
            ago: user_data[i].added_on
       });
       }
       }
       
    }  
});

schedule.scheduleJob(rule,async function(){
    const data = await reels_db.find().exec();
    if(data ==''){
        console.log('No Reels');
        
    }else{
        await reels_db.updateMany({
            $inc:{created_on: 1}
      });
      const user_data = await reels_db.find().exec();
        for(var i=0;i<user_data.length;i++){
        if(user_data[i].created_on%60 == 0){
            await reels_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on/60 + ' hr'
        });
        }else if(user_data[i].created_on <= 59){
            await reels_db.findOneAndUpdate({'_id':user_data[i]._id},{
                ago: user_data[i].created_on + ' min'
        });
        }else if(user_data[i].created_on >= 1440){
        await reels_db.findOneAndUpdate({'_id':user_data[i]._id},{
            ago: 1 + ' Day'
       });
       }else if(user_data[i].created_on >= 2880){
        await reels_db.findOneAndUpdate({'_id':user_data[i]._id},{
            ago: user_data[i].added_on
       });
       }
       }
       
    }  
});

router.post('/getGroupPagePostFeed', async function (req, res, next){
    const data = await feed_db.find({id: req.body.id, from: req.body.from})
    for(var i = 0; i < data.length; i++){
         const follow = await follow_db.find({ myUserId: req.body.userId,
            otherUserId: data[i].user_id}) ;
            const like = await likePost_db.find({ userId: req.body.userId,
                postId: data[i]._id}) 
            if(follow == ''){
               await feed_db.findByIdAndUpdate(data[i]._id,{
                    follow: false
                });
            }else{
             await feed_db.findByIdAndUpdate(data[i]._id,{
                    follow: true
                });
            }
           
                if(like == ''){
                    await feed_db.findByIdAndUpdate(data[i]._id,{
                        like: false
                    });
                }else{
                    await feed_db.findByIdAndUpdate(data[i]._id,{
                        like: true
                    });
                }
    };
    const feed_data = await feed_db.find({id: req.body.id, from: req.body.from})
    // const block = await block_db.find({myUserId: req.body.userId});
    // const blockArray = [];
    // for(var i=0;i< block.length;i++){
    //       blockArray[i]= block[i].otherUserId 
    // }
    res.json( {response: true, data: feed_data});
});

router.post('/getPostFeed', async function (req, res, next){
    const data = await feed_db.find().exec();
    for(var i = 0; i < data.length; i++){
         const follow = await follow_db.find({ myUserId: req.body.userId,
            otherUserId: data[i].user_id}) ;
            const like = await likePost_db.find({ userId: req.body.userId,
                postId: data[i]._id}) 
            if(follow == ''){
               await feed_db.findByIdAndUpdate(data[i]._id,{
                    follow: false
                });
            }else{
             await feed_db.findByIdAndUpdate(data[i]._id,{
                    follow: true
                });
            }
           
                if(like == ''){
                    await feed_db.findByIdAndUpdate(data[i]._id,{
                        like: false
                    });
                }else{
                    await feed_db.findByIdAndUpdate(data[i]._id,{
                        like: true
                    });
                }
    };
    const block = await block_db.find({myUserId: req.body.userId});
    const blockArray = [];
    for(var i=0;i< block.length;i++){
          blockArray[i]= block[i].otherUserId 
    }
    const final = await feed_db.find({_id:{$nin:blockArray}});
    res.json( {response: true, data: final});
});

/////////follow

router.post('/getFollower', async function (req, res, next){
    const user = await follow_db.find({myUserId:req.body.userId});
    if(user == ''){
        res.json( {response: false, msg: "No data", data:[]});
    }else{
        const userArray = [];
        for(var i =0;i<user.length;i++){
         userArray[i]= user[i].otherUserId
        };
        console.log(user);
        const data = await user_db.find({'_id':{$in:userArray}});
        res.json( {response: true, msg: "Success", data: data});
    }

});


router.post('/getFollowing', async function (req, res, next){
    const user = await follow_db.find({otherUserId:req.body.userId});
    if(user == ''){
        res.json( {response: false, msg: "No data", data :[]});
    }else{
        const userArray = [];
        for(var i =0;i<user.length;i++){
         userArray[i]= user[i].myUserId
        };
        console.log(user);
        const data = await user_db.find({'_id':{$in:userArray}});
        res.json( {response: true, msg: "Success", data: data});
    }
  
});

router.post('/followUser', async function (req, res, next){

    const data =  await follow_db.find({   myUserId: req.body.myUserId,
        otherUserId: req.body.otherUserId });
        if(data == ''){
            await follow_db.create({
                myUserId: req.body.myUserId,
                otherUserId: req.body.otherUserId
            });
            res.json( {response: true, msg: "Follow Success"});
        }else{
            await follow_db.findOneAndDelete({  myUserId: req.body.myUserId,
                otherUserId: req.body.otherUserId
                });
                res.json( {response: false, msg: "Unfollow Success"});
        }
    


   
   
});
//////////////////////////////////////////////// Reels

router.post('/addReelsPost',upload.single('videoUrl'), async function (req, res, next) {
    if(req.body.userId == ''){             /// hanged on requirement by 
     res.json( {response: false, msg: 'Error'});
    }else{
         const user = await user_db.findOne({'_id': req.body.userId});
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
 const user_data = await reels_db.create({
     user_id: req.body.userId,
     userName: user.name,
     userImage: user.image,
     type: req.body.type,
     videoUrl: baseUrl + req.file.filename,
     ago: 'just now',
     hashtag: req.body.hashtag,
     added_on:moment(Date.now()).format("MMM Do YYYY"),
           });

 res.json( {response: true, msg:"Success"});
    }
    
});

router.post('/getReelsPost', async function (req, res, next){
    const data = await reels_db.find().exec();
    for(var i = 0; i < data.length; i++){
         const follow = await follow_db.find({ myUserId: req.body.userId,
            otherUserId: data[i].user_id}) ;
            const like = await likePost_db.find({ userId: req.body.userId,
                postId: data[i]._id}) 
            if(follow == ''){
               await reels_db.findByIdAndUpdate(data[i]._id,{
                    follow: false
                });
            }else{
             await reels_db.findByIdAndUpdate(data[i]._id,{
                    follow: true
                });
            }
           
                if(like == ''){
                    await reels_db.findByIdAndUpdate(data[i]._id,{
                        like: false
                    });
                }else{
                    await reels_db.findByIdAndUpdate(data[i]._id,{
                        like: true
                    });
                }
    };
    const block = await block_db.find({myUserId: req.body.userId});
    const blockArray = [];
    for(var i=0;i< block.length;i++){
          blockArray[i]= block[i].otherUserId 
    }
    const final = await reels_db.find({user_id:{$nin:blockArray}});
    res.json( {response: true, data: final});
})

//////////////// follow user page group

router.post('/followUserPageGroup', async function (req, res, next){
   if(req.body.type == 'User'){
    const data =  await follow_db.find({   myUserId: req.body.userId,
        otherUserId: req.body.otherUserId });
        if(data == ''){
            await follow_db.create({
                myUserId: req.body.userId,
                otherUserId: req.body.otherUserId,
                indicator: 'Pending'
            });
            await suggestion_db.findOneAndUpdate({myUserId:req.body.userId},{
                $pull:{otherUserId:  req.body.otherUserId} 
                });
            res.json( {response: true, msg: "Follow Success"});
        }else{
            await follow_db.findOneAndDelete({  myUserId: req.body.userId,
                otherUserId: req.body.otherUserId
                });
                await suggestion_db.findOneAndUpdate({myUserId:req.body.userId},{
                    $push:{otherUserId:  req.body.otherUserId} 
                    });
                res.json( {response: false, msg: "Unfollow Success"});
        }
   }else if(req.body.type == 'Group'){
    const data =  await followGroup_db.find({   groupId: req.body.userId,
        otherUserId: req.body.otherUserId });
        if(data == ''){
            await followGroup_db.create({
                groupId: req.body.userId,
                otherUserId: req.body.otherUserId,
                indicator: 'Pending'
            });
            res.json( {response: true, msg: "Following Group "});
        }else{
            await followGroup_db.findOneAndDelete({  groupId: req.body.userId,
                otherUserId: req.body.otherUserId
                });
                res.json( {response: false, msg: "Unfollowed Group "});
        }
   }else{
    const data =  await followPage_db.find({   pageId: req.body.userId,
        otherUserId: req.body.otherUserId });
        if(data == ''){
            await followPage_db.create({
                pageId: req.body.userId,
                otherUserId: req.body.otherUserId,
                indicator: 'Pending'
            });
            res.json( {response: true, msg: "Following Page"});
        }else{
            await followPage_db.findOneAndDelete({  pageId: req.body.userId,
                otherUserId: req.body.otherUserId
                });
                res.json( {response: false, msg: "Unfollowed Page"});
        }
   }
});

router.post('/getFollowRequest', async function (req, res, next){
    if(req.body.type == 'User'){
     const data =  await follow_db.find({ myUserId: req.body.userId});
         if(data == ''){
             res.json( {response: false, msg: "No Request"});
         }else{
            const userArray = [];
            for(var i =0;i<data.length;i++){
             userArray[i]= data[i].otherUserId
            };
            const user = await user_db.find({_id: {$in:userArray}})
                 res.json( {response: true, msg: "RequestFound", data: user});
         }
    }else if(req.body.type == 'Group'){
        const data =  await followGroup_db.find({ myUserId: req.body.userId});
        if(data == ''){
            res.json( {response: false, msg: "No Request"});
        }else{
           const userArray = [];
           for(var i =0;i<data.length;i++){
            userArray[i]= data[i].otherUserId
           };
           const user = await user_db.find({_id: {$in:userArray}})
                res.json( {response: true, msg: "Request Found", data: user});
        }
    }else{
     const data =  await followPage_db.find({   pageId: req.body.userId});
         if(data == ''){
             res.json( {response: false, msg: "No Request"});
         }else{
            const userArray = [];
            for(var i =0;i<data.length;i++){
             userArray[i]= data[i].otherUserId
            };
            const user = await user_db.find({_id: {$in:userArray}})
               
            res.json( {response: true, msg: "Request Found", data: user});
         }
        }
 });

 router.post('/acceptFollowRequest', async function (req, res, next){
    if(req.body.type == 'User'){
        const data =  await follow_db.findOneAndUpdate({   myUserId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Accepted'
            });
          
                    res.json( {response: true, msg: "Request Accepted"});
            
       }else if(req.body.type == 'Group'){
        const data =  await followGroup_db.findOneAndUpdate({   groupId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Accepted'
            });
          
                    res.json( {response: true, msg: "Request Accepted"});
       }else{
        const data =  await followPage_db.findOneAndUpdate({   pageId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Accepted'
            });
          
                    res.json( {response: true, msg: "Request Accepted"});
       }
 });

 router.post('/rejectFollowRequest', async function (req, res, next){
    if(req.body.type == 'User'){
        const data =  await follow_db.findOneAndUpdate({   myUserId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Reject'
            });
            await suggestion_db.findOneAndUpdate({myUserId:req.body.userId},
                {$push:{otherUserId:  req.body.otherUserId}});
          
                    res.json( {response: true, msg: "Request Rejected"});
            
       }else if(req.body.type == 'Group'){
        const data =  await followGroup_db.findOneAndUpdate({   groupId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Reject'
            });
          
                    res.json( {response: true, msg: "Request Rejected"});
       }else{
        const data =  await followPage_db.findOneAndUpdate({   pageId: req.body.userId,
            otherUserId: req.body.otherUserId },{
                indicator: 'Reject'
            });
          
                    res.json( {response: true, msg: "Request Rejected"});
       }
 });

///////////////block User

router.post('/blockUser', async function (req, res, next){

    const data =  await block_db.find({   myUserId: req.body.myUserId,
        otherUserId: req.body.otherUserId });
        if(data == ''){
            await block_db.create({
                myUserId: req.body.myUserId,
                otherUserId: req.body.otherUserId
            });
            res.json( {response: true, msg: "Blocked Successfully"});
        }else{
            await suggestion_db.findOneAndUpdate({
                myUserId: req.body.myUserId
            },{
                  $push: {otherUserId: req.body.otherUserId } 
            });
            await block_db.findOneAndDelete({  myUserId: req.body.myUserId,
                otherUserId: req.body.otherUserId
                });
                res.json( {response: false, msg: "Unblocked Successfully"});
        }
   
});

router.post('/getBlockList', async function (req, res, next){
    const user = await block_db.find({myUserId:req.body.userId});
    if(user == ''){
        res.json( {response: false, msg: "No data", data :[]});
    }else{
        const userArray = [];
        for(var i =0;i<user.length;i++){
         userArray[i]= user[i].otherUserId
        };
        console.log(user);
        const data = await user_db.find({'_id':{$in:userArray}});
        res.json( {response: true, msg: "Success", data: data});
    }
  
});

//////////////Suggestion List

router.post('/getSuggestedFriends', async function (req, res, next){

    const data =  await suggestion_db.find({ myUserId: req.body.myUserId });
        if(data == ''){
            const user = await user_db.find({ _id: {$ne:req.body.myUserId}});
            const userArray = [];
            for(var i=0;i< user.length;i++){
                   let id = user[i]._id;
                   console.log(id.toString());
                   userArray[i] = id.toString()
            }
            await suggestion_db.create({
                myUserId: req.body.myUserId,
                otherUserId: userArray
            });
            
            res.json( {response: true, msg: " Successfully", data: user });
        }else{
            const array = data[0].otherUserId;
            const block = await block_db.find({myUserId: req.body.myUserId});
            if(block != '')
            {
                for(var i=0;i< block.length;i++){
                    await suggestion_db.findOneAndUpdate({
                        myUserId: req.body.myUserId
                    },{
                          $pull: {otherUserId: block[i].otherUserId } 
                    });
                }
            }
            const user = await user_db.find({_id: {$in:array}});
                res.json( {response: true, msg: "Successfully", data : user});
        }
   
});

router.post('/removeSuggestedFriend', async function (req, res, next){
     await suggestion_db.findOneAndUpdate({myUserId:req.body.userId},{
    $pull:{otherUserId:  req.body.otherUserId} 
    });
    const data =  await suggestion_db.find({ myUserId: req.body.userId });
    const array = data[0].otherUserId;
    console.log(array);
    const user = await user_db.find({_id: {$in:array}});
        res.json( {response: true, msg: "Successfully", data : user});
  
});

////like post

router.post('/likePost', async function (req, res, next){
    const data =  await likePost_db.find({ userId: req.body.userId,
    postId: req.body.postId});
    if(data == ''){
        await likePost_db.create({
            userId: req.body.userId,
            postId: req.body.postId
        });
        
         await feed_db.findByIdAndUpdate(req.body.postId,{
           $inc:{
            likeCount: 1
           }
                
          
        });
        const count = await feed_db.findById(req.body.postId );
        console.log(count);
        res.json( {response: true, msg: "Liked", likeCount: count.likeCount});
    }else{
        await likePost_db.findOneAndDelete({ userId: req.body.userId,
            postId: req.body.postId
            });
           
            await feed_db.findByIdAndUpdate(req.body.postId,{
                $inc:{
                    likeCount: -1
                }
            });
            const count = await feed_db.findById( req.body.postId );
            res.json( {response: false, msg: "Disliked", likeCount: count.likeCount});
    }

   
});
////////////////like reels
router.post('/likeReels', async function (req, res, next){
    const data =  await likePost_db.find({ userId: req.body.userId,
    postId: req.body.reelsId});
    if(data == ''){
        await likePost_db.create({
            userId: req.body.userId,
            postId: req.body.reelsId
        });
        
         await reels_db.findByIdAndUpdate(req.body.reelsId,{
           $inc:{
            likeCount: 1
           }
                
          
        });
        const count = await reels_db.findById(req.body.reelsId );
        console.log(count);
        res.json( {response: true, msg: "Liked", likeCount: count.likeCount});
    }else{
        await likePost_db.findOneAndDelete({ userId: req.body.userId,
            postId: req.body.reelsId
            });
           
            await reels_db.findByIdAndUpdate(req.body.reelsId,{
                $inc:{
                    likeCount: -1
                }
            });
            const count = await reels_db.findById( req.body.reelsId );
            res.json( {response: false, msg: "Disliked", likeCount: count.likeCount});
    }

   
});

///////////////comment reels
router.post('/commentReels', async function (req, res, next){
    const user = await user_db.findOne({'_id': req.body.userId});
    console.log(user)
    await commentPost_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        postId: req.body.reelsId,
        comment: req.body.comment
    });
    await feed_db.findByIdAndUpdate(req.body.reelsId,{
        $inc:{
            commentCount: 1
        }
    });
    const count = await commentPost_db.find({postId: req.body.reelsId });
    res.json( {response: true, msg: "Success"});
});

router.post('/commentOnReelsComment', async function (req, res, next){
    const user = await user_db.findOne({'_id': req.body.userId});
    console.log(user);
    const comment = await commentPost_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        postId: req.body.commentId,
        comment: req.body.comment
    });
    await reels_db.findByIdAndUpdate(req.body.reelsId,{
        $inc:{
            commentCount: 1
        }
    });
    const result = await commentPost_db.findById(req.body.commentId);
    res.json( {response: true, msg: "Success"});
});
/////////////comment on post

router.post('/commentPost', async function (req, res, next){
    const user = await user_db.findOne({'_id': req.body.userId});
    console.log(user)
    await commentPost_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        postId: req.body.postId,
        comment: req.body.comment
    });
    await feed_db.findByIdAndUpdate(req.body.postId,{
        $inc:{
            commentCount: 1
        }
    });
    const count = await commentPost_db.find({postId: req.body.postId });
    res.json( {response: true, msg: "Success"});
});

router.post('/commentOnPostComment', async function (req, res, next){
    const user = await user_db.findOne({'_id': req.body.userId});
    console.log(user);
    const comment = await commentPost_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        postId: req.body.commentId,
        comment: req.body.comment
    });
    await feed_db.findByIdAndUpdate(req.body.postId,{
        $inc:{
            commentCount: 1
        }
    });
    const result = await commentPost_db.findById(req.body.commentId);
    res.json( {response: true, msg: "Success"});
});

router.post('/getCommentPost', async function (req, res, next){
   const result = await commentPost_db.find({postId: req.body.postId });
   for(var i = 0;i< result.length;i++){
    const data = await commentPost_db.find({postId: result[i]._id});
    await commentPost_db.findByIdAndUpdate(result[i]._id,{
            commentArray: data
    });
   }
   const final = await commentPost_db.find({postId: req.body.postId });
            return res.json({response: true, msg:"User found", data: final});
 
});

router.post('/likePostComment', async function (req, res, next){
    const data =  await likePostComment_db.find({ userId: req.body.userId,
        commentId: req.body.commentId});
        if(data == ''){
            await likePostComment_db.create({
                userId: req.body.userId,
                commentId: req.body.commentId
            });
            const count = await likePostComment_db.find({postId: req.body.commentId });
            await commentPost_db.findByIdAndUpdate(req.body.commentId,{
                likeCount: count.length
            });
            res.json( {response: true, msg: "Liked", likeCount: count.length});
        }else{
            await likePost_db.findOneAndDelete({ userId: req.body.userId,
                commentId: req.body.commentId
                });
                const count = await likePostComment_db.find({commentId: req.body.commentId });
                await commentPost_db.findByIdAndUpdate(req.body.commentId,{
                    likeCount: count.length
                });
                res.json( {response: false, msg: "Disliked", likeCount: count.length});
        }
});



router.post('/deletePostComment', async function (req, res, next){
    await commentPost_db.findByIdAndDelete(req.body.commentId);
    await feed_db.findByIdAndUpdate(req.body.postId,{
        $inc:{
            commentCount: -1
        }
    });
    res.json( {response: true, msg: "Deleted Successfully"});
});

router.post('/savePost', async function (req, res, next){
    const data =  await savePost_db.find({ userId: req.body.userId,
        postId: req.body.postId});
        if(data == ''){
            await savePost_db.create({
                postId: req.body.postId,
                 userId: req.body.userId
              });
              res.json( {response: true, msg: "Post Saved Successfully"});
        }else{
            await savePost_db.findOneAndDelete({ userId: req.body.userId,
                postId: req.body.postId
                });
                res.json( {response: false, msg: "Post Unsaved Successfully"});
        }
      

   
});

router.post('/getSavedPost', async function(req, res, next){
           const data = await savePost_db.find({userId: req.body.userId});
           let saved = [];
           for(var i=0; i< data.length;i++){
            saved[i] = data[i].postId;
           }
           console.log(saved);
           const post = await feed_db.find({'_id':{$in:saved}});
           res.json( {response: true, msg: "Success", data: post});
});


/////////////////////////////////////feed Story///////////////////////

router.post('/addFeedStory',upload.single('url'), async function (req, res, next) {
            const user = await user_db.findOne({'_id': req.body.userId});
     let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    await feedStory_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        url: baseUrl + req.file.filename,
        about: req.body.about
              });

    res.json( {response: true, msg:'Story Added'});
});

router.post('/viewFeedStory', async function (req, res, next) {
    const user = await user_db.findOne({'_id': req.body.userId});
    const viewer = {
             userId: user._id,
             userImage: user.name,
             userName: user.image
    };
    console.log(viewer);
await feedStory_db.findByIdAndUpdate(req.body.storyId,{
viewUser: viewer
      });

      const user_data = await feedStory_db.findById(req.body.storyId);
res.json( {response: true, msg: 'viewer added'});
});

router.post('/getFeedStory', async function (req, res, next) {
    const story = await feedStory_db.find({userId: req.body.userId});
    res.json( {response: true, data: story});
});

router.post('/deleteFeedStory',upload.single('url'), async function (req, res, next) {
    const story = await feedStory_db.deleteOne({'_id': req.body.storyId});
    res.json( {response: true, msg: 'Data deleted Successfully'});
});

router.post('/postProfile',async function (req, res, next) {

   
    const user = await user_db.findById({'_id': req.body.userId});
    const follow = await follow_db.find({myUserId: req.body.userId});
    const follower = [];
    for(var i=0;i< follow.length;i++){
    follower[i] = follow[i].otherUserId;
    }
    const follows = await follow_db.find({otherUserId: req.body.userId});
    const following = [];
    for(var i=0;i< follows.length;i++){
    following[i] = follows[i].myUserId;
    }
    const post = await feed_db.find({user_id: req.body.userId});
    const count = await feed_db.find({user_id: req.body.userId}).count();
    const feedImage = [];
    const feedVideo = [];
    for(var i=0;i< post.length;i++){
        if(post[i].type == 'Video'){
            feedVideo.push({url:post[i].url});
        }else if(post[i].type == 'Image'){
            feedImage.push({url:post[i].url});
        }
        }

    const user_data = [];
    if(req.body.userId == req.body.myUserId){
        user_data[0]= {
            mobile: user.mobile,
            areYouFollowing: "",
            aboutBusiness: user.about_business,
            address: user.address,
            name: user.name,
            userName: user.user_name,
            userType: user.user_type,
            whatsappAllow: user.whatsapp,
            email: user.email,
            image: user.image,
            stateId: user.stateId,
            statename:user.stateName,
            cityId: user.cityId,
            cityName: user.cityName,
            follower: follower.length,
            totalPost: count,
            following: following.length,
            feedImage: feedImage,
            feedVideo: feedVideo
        }
        res.json( {response: true, msg: 'Data Found', data: user_data});
    }else{
        const follow = await follow_db.findOne({  myUserId: req.body.myUserId,
            otherUserId: req.body.userId, indicator:'Accepted'||'default'});
            console.log(follow);
            if(follow == null){
                user_data[0]= {
                    mobile: user.mobile,
                    areYouFollowing: 'No',
                    aboutBusiness: user.about_business,
                    address: user.address,
                    name: user.name,
                    userName: user.user_name,
                    userType: user.user_type,
                    whatsappAllow: user.whatsapp,
                    email: user.email,
                    image: user.image,
                    stateId: user.stateId,
                    statename:user.stateName,
                    cityId: user.cityId,
                    cityName: user.cityName,
                    follower: follower.length,
                    totalPost: count,
                    following: following.length,
                    feedImage: feedImage,
                    feedVideo: feedVideo
                }
                res.json( {response: true, msg: 'Data Found', data: user_data});
            }else{
                user_data[0]= {
                    mobile: user.mobile,
                    areYouFollowing: 'Yes',
                    aboutBusiness: user.about_business,
                    address: user.address,
                    name: user.name,
                    userName: user.user_name,
                    userType: user.user_type,
                    whatsappAllow: user.whatsapp,
                    email: user.email,
                    image: user.image,
                    stateId: user.stateId,
                    statename:user.stateName,
                    cityId: user.cityId,
                    cityName: user.cityName,
                    follower: follower.length,
                    totalPost: count,
                    following: following.length,
                    feedImage: feedImage,
                    feedVideo: feedVideo
                }
                res.json( {response: true, msg: 'Data Found', data: user_data});
            }
       
    }
 
});

module.exports = router;