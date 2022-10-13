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
const feed_db = require('../models/feed');
const follow_db = require('../models/follow');
const likePost_db = require('../models/likePost');

const feedStory_db = require('../models/feedStory');
const likePostComment_db = require('../models/likeComment');
const commentPost_db = require('../models/comment');
const activity_db = require('../models/activity');
const savePost_db = require('../models/savePost');
///// mongodb

const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

////////////////////////////////////////////////mongodb
// Mongo URI
const mongoURI = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';

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
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
  ///////
  router.get('/files', (req, res) => {
  gfs.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
///

    // Check if image
    if(file.contentType === 'image/jpeg' || file.contentType 
    ==='image/png') 
    {
       const readStream = gridfsBucket.openDownloadStream(file._id);
       readStream.pipe(res);
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect('/');
  });
});
///////////
const moment = require('moment');
const { ResultStorage } = require('firebase-functions/v1/testLab');
const feedStory = require('../models/feedStory');


function AddMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}


// //////////////////////////////////



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
       if(req.body.user_id == ''){             /// hanged on requirement by 
        res.json( {response: false, msg: 'Error'});
       }else{
        var activityVar = { 
            icon: req.body.icon,
            name: req.body.activityName,
            };
           
            const user = await user_db.findOne({'_id': req.body.user_id});
     let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    const user_data = await feed_db.create({
        user_id: req.body.user_id,
        userName: user.name,
        userImage: user.image,
        type: req.body.type,
        url: baseUrl + req.file.filename,
        location: req.body.location,
        activity: activityVar,
        about: req.body.about,
              });

    res.json( {response: true, data: user_data});
       }
       
});

router.post('/getPostFeed', async function (req, res, next){
    const data = await feed_db.find().exec();
    for(var i = 0; i < data.length; i++){
         const follow = await follow_db.find({ myUserId: req.body.userId,
            otherUserId: data[i].user_id}) ;
            const like = await likePost_db.find({ userId: req.body.userId,
                postId: data[i]._id}) ;
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
    const final = await feed_db.find().exec();
    res.json( {response: true, data: final});
})

/////////follow

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
////like post


router.post('/likePost', async function (req, res, next){

    const data =  await likePost_db.find({ userId: req.body.userId,
    postId: req.body.postId});
    if(data == ''){
        await likePost_db.create({
            userId: req.body.userId,
            postId: req.body.postId
        });
        const count = await likePost_db.find({postId: req.body.postId });
        res.json( {response: true, msg: "Liked", likeCount: count.length});
    }else{
        await likePost_db.findOneAndDelete({ userId: req.body.userId,
            postId: req.body.postId
            });
            const count = await likePost_db.find({postId: req.body.postId });
            res.json( {response: false, msg: "Disliked", likeCount: count.length});
    }

   
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
    const user_data = await feedStory_db.create({
        userId: req.body.userId,
        userName: user.name,
        userImage: user.image,
        url: baseUrl + req.file.filename,
        about: req.body.about
              });

    res.json( {response: true, msg:'Story Added',data: user_data});
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


router.post('/getFeedStory',upload.single('url'), async function (req, res, next) {
    const story = await feedStory_db.find({userId: req.body.userId});
    res.json( {response: true, data: story});
});

router.post('/deleteFeedStory',upload.single('url'), async function (req, res, next) {
    const story = await feedStory_db.deleteOne({'_id': req.body.storyId});
    res.json( {response: true, msg: 'Data deleted Successfully'});
});

module.exports = router;