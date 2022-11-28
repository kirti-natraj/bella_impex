var express = require('express');
var router = express.Router();
const request=require('request')
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const noti_db = require('../models/noti');
const subscription_db = require('../models/subscription');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const banner_db = require('../models/banner');
const state_db = require('../models/state');
const admin_invoice = require('../models/adminInvoice');
const city_db = require('../models/city');
const moment = require('moment');
const cors = require('cors')
const app = express();
app.use(cors());
const fs = require('fs');
var FCM = require('fcm-node');

//////////////////////////////
const mongodb = require("mongodb").MongoClient;
const csv = require("csvtojson");
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

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
////////////////////////////////////////////////
//mongodb    connection 
//////////////////////////////////////////

/* GET home page. */
router.get('/',  function(req, res, next) {    
              //for login Page
  res.render('login', { title: '' });
});

router.post('/addUser', async function(req, res, next) {    
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
});

//////////////////////////////////////////////state nd city

router.get('/setState',async function (req, res, next) {
      
  const state =  await city_db.create(
    {
      state_id: "633ed767e7a4a0e9a48ce760",
      city_name: "Ujjain"
    }
  );
  return res.json({response: true, msg:"Page found" })
 
});

///////////////////////////////////////brand

router.get('/brand',async function(req,res,next){                        //for UserTable Page
  const vehicle = await category_db.findOne({category_name: "Vehicles"});
  console.log(vehicle._id);
  const data = await brand_db.find({categoryId: vehicle._id});
  
  res.render('brand',{title:'Brand Table',data : data});


});
router.get('/brand_form/:id',async function(req,res,next){                        //for Category TAble Update
 
  res.render('brand_form',{title:'Add Brand', id: req.params.id});

});

router.get('/filter_form/:id',async function(req,res,next){                        //for Category TAble Update
 
  res.render('filter',{title:'Add Filter', id: req.params.id});

});

router.get('/view_filter/:id',async function(req,res,next){                        //for Category TAble Update
  const brand = await brand_db.find({categoryId: req.params.id});
  const budget = await budget_db.find({category_id: req.params.id});
  res.render('view_filter',{title:'View Filter', data: brand, budget: budget});

});
router.post('/add_brand_form/:id', upload.single('image'), async function(req, res, next) {                          //category add
  let baseUrl = 'http://belle-impex-360513.el.r.appspot.com/image/';
  await brand_db.create({
      brand_name: req.body.brand_name,
      image: baseUrl+req.file.filename,
      categoryId: req.params.id
  });
  if(req.params.id == '6353f6905398c68d20628eaf'){
    res.redirect('/brand/');
  }else{
    res.redirect('/view_filter/'+req.params.id);
  }
 
});

router.get('/brand_update_form/:id',async function(req,res,next){                        //for Category TAble Update
  const data = await brand_db.findById(req.params.id);
  res.render('brand_update_form',{title:'Update Brand' , data : data });

});

router.post('/update_brand_form/:id', upload.single('image'), async function(req, res, next) {  
  const cat =  await brand_db.findById(req.params.id);
  const original = cat.image;
  const filename = original.replace('http://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(filename);
  const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);                      //category add
  let baseUrl = 'http://belle-impex-360513.el.r.appspot.com/image/';
  await brand_db.findByIdAndUpdate(req.params.id, {
      brand_name: req.body.brand_name,
      image: baseUrl+req.file.filename
  });
  if(req.params.id == '6353f6905398c68d20628eaf'){
    res.redirect('/brand/');
  }else{
    res.redirect('/view_filter/'+req.params.id);
  }
});
/////////////////////////////////////////year
router.get('/year',async function(req,res,next){                        //for UserTable Page
  const data = await year_db.find().exec();
  
  res.render('year',{title:'Year Table',data : data});


});
router.get('/year_form',async function(req,res,next){                        //for Category TAble Update
 
  res.render('year_form',{title:'Add Year'});

});


router.post('/add_year_form',  async function(req, res, next) {                          //category add

  await year_db.create({
      year: req.body.year
  });
  res.redirect('/year/');
});
/////////////////////////////////////budgte

router.get('/budget',async function(req,res,next){                        //for UserTable Page
  const vehicle = await category_db.findOne({category_name: "Vehicles"});
  console.log(vehicle._id);
  const data = await budget_db.find({category_id:vehicle._id});
  
  res.render('budget',{title:'Budget Table',data : data, id: vehicle._id});

});

router.get('/budget_form/:id',async function(req,res,next){                        //for Category TAble Update
 
  res.render('budget_form',{title:'Add Budget', id: req.params.id});

});

router.post('/add_budget_form/:id',  async function(req, res, next) {                          //category add
  await budget_db.create({
      category_id: req.params.id,
      budget: req.body.budget,
      from: req.body.from,
      to: req.body.to
  });
  if(req.params.id == '6353f6905398c68d20628eaf'){     //static
    res.redirect('/budget/');
  }else{
    res.redirect('/view_filter/'+req.params.id);
  }
  
});

/////////////////////////////////////Notifiction


router.get('/notification',async function(req,res,next){  
  const data = await noti_db.find().exec();                      //for Category TAble Update
  res.render('noti_list', {title:'Notification', data : data, moment:moment});

});

router.get('/notification_list',async function(req,res,next){                        //for Category TAble Update
  const data = await noti_db.find().exec();
  const user_data = await user_db.find().exec();
  res.render('noti_list', {title:'Notification', data : data,  moment:moment});

});

router.get('/notification_form',async function(req,res,next){                        //for Category TAble Update
 
  res.render('noti_form',{title:'Add Notification'});

});

router.post('/add_notification_form',  async function(req, res, next) {                          //category add
 
  
 const user = await user_db.find().exec();
  /////////////////////firebase
 
  var FCM = require('fcm-node');
  var serverKey = 'AAAAP6Bdr-Y:APA91bEAKk8D9UpPF5O4KHZR9WkbW5sfaJL7hOF3Yjpb7cHADxrG4cteVRbjbizcMk0V2uJNCeuqdGut00lncrzv3HDTv8j2Fdj4AhrL-XvvUsHSCsyEQqXFJsQID_t-cMBTMfA3oB71';
  var fcm = new FCM(serverKey);
  var success = 0;
for(var i = 0; i < user.length;i++){
 if(user[i].fcmToken.length > 10 ){
  var message = {  
    "to": user[i].fcmToken,
      "notification": {
         "title":req.body.title,
          "body":req.body.msg
      }
  }
  fcm.send(message, function(err, response) {
    if (err) {
        console.log("Something has gone wrong!"+err);
        console.log("Respponse:! "+response);
    } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
        
    }

});
success = success + 1;
}
}
await noti_db.create({
  title: req.body.title,
  msg: req.body.msg,
  successCount: success
});
const data = await noti_db.find().exec();                      //for Category TAble Update
  res.render('noti_list', {title:'Notification', data : data, moment:moment});

  
});


/////////////////////////////////////Banner

router.get('/banner_list',async function(req,res,next){                        //for UserTable Page
  const data = await banner_db.find().exec();
 
  res.render('banner_list',{title:'Banner List',data : data, moment: moment});


});
router.get('/banner',async function(req,res,next){                        //for Category TAble Update
 
  res.render('banner',{title:'Add Banner'});

});

router.get('/update_banner/:id',async function(req,res,next){                        //for Category TAble Update
 const data = await banner_db.findById(req.params.id);
 console.log(data);
 res.render('banner_update',{title:'Update Banner', data: data});

});

router.post('/add_banner', upload.single('image'), async function(req, res, next) {                          //category add
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
  await banner_db.create({
     
      image: baseUrl + req.file.filename
 
  });
  res.redirect('/banner_list/');
});

  router.post('/updateBanner/:id', upload.single('image'), async function(req, res, next) {                          //category add
    const cat =  await banner_db.findById(req.params.id);
    const original = cat.image;
    const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filename);
    const file = await gfs.files.findOne({filename: filename});
    await gridfsBucket.delete(file._id);
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    await banner_db.findByIdAndUpdate(req.params.id, {
       
        image: baseUrl + req.file.filename
   
    });

  res.redirect('/banner_list/');
});

/////////////////////////////////////index
router.get('/index',async function(req,res,next){     
  const totalUser = await user_db.count();    
  const totalCat = await category_db.count();
  const totalSub = await subcategory_db.count();
  const totalProduct = await product_db.count() +await vehicle_db.count() + await properties_db.count() ;
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();               //for Dashboard Page
  res.render('index',{title: 'Dashboard',totalUser: totalUser, 
  totalCat:totalCat, totalSub: totalSub, totalProduct: totalProduct,
  data: data, sub_data: sub_data});
});

router.get('/user',async function(req,res,next){                        //for UserTable Page
  const data = await user_db.find().exec();
  
  res.render('user',{title:'User Table',data : data});

});

router.get('/view_user_detail/:id',async function(req,res,next){                        //for UserTable Page
  const data = await user_db.findById(req.params.id);
 let state = 0;
  let city = 0;
  if(data.stateId.length != 8){
    state = 'Not added'
  }else{
    state = await state_db.find({'_id':data.stateId});
  }
  if(data.cityId.length != 8)
  {
     city = 'Not Added'
  }else{

     city = await city_db.find({'_id':data.cityId});
  }
 
  res.render('view_user',{title:'User Table',data : data, state: state, city: city});


});
router.get('/add_user',async function(req,res,next){                        //for UserTable Page
  
  res.render('add_user',{title:'Add User '});


});

router.post('/add_user_form', async function(req, res, next){
  const data = await user_db.findOne({user_name: req.body.gmail });
  console.log(data);
  if(data == null) 
  {  
     const user_data = await user_db.create({
          user_name: req.body.gmail,
          user_type: "Gmail",
          added_on: moment(Date.now()).format("MMM Do YY"),
      })
      res.json({ response: false , msg: "Gmail not exist, OTP Sent Successfully!", data: '', user_id: user_data._id});
      
  }
  else 
  {
      res.json({response: true, msg:"Gmail Exist", data: '', user_id: data._id})
  }
});

router.get('/active_deactive/:id',async function(req,res,next){                        //for UserTable Page
  const data = await user_db.findById(req.params.id);
  if(data.status == true){
    await user_db.findByIdAndUpdate(req.params.id,{
      status: false
    });
  }else{
    await user_db.findByIdAndUpdate(req.params.id,{
      status: true
    });
  }
  const user = await user_db.find().exec();
  res.render('user',{title:'User Table',data : user});


});

//////////////////////////view Image For Product




///////////////////////////////////////////susbscription
router.get('/subscription',async function(req,res,next){                        //for UserTable Page
  const data = await subscription_db.find().exec();
  res.render('subscription',{title:'Subscription List',data : data,  moment: moment});

});

router.get('/add_subscription',async function(req,res,next){                        //for Category TAble Update
 
  res.render('add_subscription',{title:'Add Subscription'});

});

router.get('/update_subscription/:id',async function(req,res,next){                        //for Category TAble Update
  const data = await subscription_db.findById(req.params.id);
  res.render('subscription_update',{title:'Update Subscription' , data : data });

});

router.post('/add_subscription_form',  async function(req, res, next) {                          //category add
  const gst = req.body.gst;
  console.log(gst);
  await subscription_db.create({
      subscription_name: req.body.subscription_name,
      description: req.body.description,
      duration: req.body.duration,
      amount: req.body.amount*18,
      gst: gst,
      total: req.body.amount*(gst/100) + req.body.amount
  });
  await noti_db.create({
    title: 'New Subscription Plan Added',
    msg: '---->  '+req.body.subscription_name+'  added  '
  })
  res.redirect('/subscription/');

});

router.post('/update_subscription_form/:id',  async function(req, res, next) {                          //category add
  const gst = req.body.gst;
  console.log(gst);
  await subscription_db.findByIdAndUpdate(req.params.id,{
      subscription_name: req.body.subscription_name,
      description: req.body.description,
      duration: req.body.duration,
      amount: req.body.amount,
      gst: gst,
      total: req.body.amount*(gst*100) + req.body.amount
  });
  res.redirect('/subscription/');

});

router.get('/subscriptionPlans', async function(req,res, next){

  const data = await subscription_db.find().exec();
  res.json({response: true, msg:"Subscription Plans", data: data })

});
///////////////////////////////////////////////category
router.get('/category',async function(req,res,next){                        //for UserTable Page
      const data = await category_db.find().exec();
      const brand = await brand_db.find().exec();
      const budget = await budget_db.find().exec();
      const first = await category_db.findOne({category_name: 'Vehicles'});
      const second = await category_db.findOne({category_name: 'Properties'});
      const third = await category_db.findOne({category_name:'Mobile'});
      const last =[];
      last[0]= { _id: first._id,
      category_name: first.category_name,
      image: first.image,
      created_on: first.created_on,
      created_by: 'Admin',
      status: true,
      __v: 0};
     
      last[1] = { _id: second._id,
        category_name: second.category_name,
        image: second.image,
        created_on:second.created_on,
        created_by: 'Admin',
        status: true,
        __v: 0};
      
        last[2]= { _id: third._id,
          category_name: third.category_name,
          image: third.image,
          created_on: third.created_on,
          created_by: 'Admin',
          status: true,
          __v: 0};

      for(var i=0;i<data.length;i++){
        if(data[i].category_name != 'Vehicles' && data[i].category_name != 'Properties' && data[i].category_name != 'Mobile'){
          last.push(data[i]);
        }
      }
      console.log(last);
      res.render('category',{title:'Category List',data : last,  moment: moment, brand: brand, budget: budget});
});



router.get('/add_category',async function(req,res,next){                        //for Category TAble Update
 
  res.render('add_category',{title:'Add Category'});

});


router.post('/add_category_form', upload.single('image'), async function(req, res, next) {                          //category add
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
  await category_db.create({
      category_name: req.body.category_name,
      image: baseUrl + req.file.filename
  });
  await noti_db.create({
    title: 'New Category Added',
    msg: '---->  '+req.body.category_name+' added'
  })
  res.redirect('/category/');

});

router.get('/update_category/:id', async function(req,res,next ){
  let id= req.params.id
  const data = await category_db.find({'_id':id});
  
  res.render('category_update', {data:data , id:id,title: 'Update Category' });
});

router.post('/update_cat_form/:id', upload.single('image'), async function(req,res,next ){
  let _id = req.params.id;
  const cat =  await category_db.findById(_id);
  const original = cat.image;
  const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(filename);
  const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';

    const a1= await category_db.findByIdAndUpdate( _id, {
      category_name: req.body.category_name,
      image: baseUrl + req.file.filename
   
    });
 
  
  res.redirect('/category/');
});
////////////////////////////////////// Subscription //////

router.get('/viewState',async function(req,res,next){                        //for SubCategory TAble Update

  const state = await state_db.find().exec();
  const city = await city_db.find().exec();
  
  res.render('viewState',{title:' State / City List ', data: state, sub_data: city });

});

router.get('/addState',async function(req,res,next){                        //for SubCategory TAble Update

  res.render('addState',{title:'Add State/City '});

});

router.get('/addCity/:id',async function(req,res,next){                        //for SubCategory TAble Update
  const state = await state_db.findById(req.params.id);
  res.render('addCity',{title:'Add State/City ', id: req.params.id, state: state.state_name});

});
router.post('/addStateForm',upload.single('image'), async function(req,res,next){                        //for SubCategory TAble Update
  
  const baseUrl = 'http://belle-impex-360513.el.r.appspot.com/image/';
  const newUrl =  baseUrl + req.file.filename;
  // console.log(typeof newUrl);
  console.log(req.files)
  console.log(req.file.filename)
  // console.log(typeof req.file)

try{
  await csv()
  .fromStream(request.get(newUrl))
  .then(source => {
    for (var i = 0; i < source.length; i++) {
      var oneRow = {
          stateName: source[i]["state_name"]
      };
      state_db.create({
        state_name: source[i]["state_name"]
      })
    }
    res.redirect('/viewState/');
  });
}catch(e){
console.log(e);
alert("CSV format is not correct");
}
 
});
  router.post('/addCityForm/:id',upload.single('image'), async function(req,res,next){                        //for SubCategory TAble Update
  
    const baseUrl = 'http://belle-impex-360513.el.r.appspot.com/image/';
    const newUrl =  baseUrl + req.file.filename;
    // console.log(typeof newUrl);
    console.log(req.files)
    console.log(req.file.filename)
    // console.log(typeof req.file)
  
  
    await csv()
    .fromStream(request.get(newUrl))
    .then(source => {
      for (var i = 0; i < source.length; i++) {
        var oneRow = {
            cityName: source[i]["city_name"]
        };
        city_db.create({
          state_id: req.params.id,
          city_name: source[i]["city_name"]
        })
      }
      res.redirect('/viewState/');
    });
});

//////////////////////////////////////subcat
router.get('/subcategory_list',async function(req,res,next){                        //for SubCategory TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();
  res.render('subcategory_list',{title:'Subcategory List', data: data, sub_data: sub_data, moment: moment});

});

router.get('/add_subcategory/:id',async function(req,res,next){                        //for Category TAble Update
  let _id = req.params.id;
  const category_name = await category_db.findById(_id);
  
  res.render('add_subcategory',{title:'Add Subcategory', id: _id, category_name: category_name});

});
router.post('/subcategory_form/:id', async function(req,res,next ){                          //for updating subcategory info
  let _id = req.params.id;
 const data = await subcategory_db.create({
      category_name: req.body.category,
      sub_category_name: req.body.sub_category_name,
      created_on: Date.now(),
      category_id: _id,
    
  });
  const sub_data = await subcategory_db.find().exec();
 res.redirect('/subcategory_list');

});

router.get('/update_subcat/:id', async function(req,res,next ){
  let id= req.params.id
  const sub_data = await subcategory_db.find({'_id':id});
  const data = await category_db.find({'_id': sub_data[0].category_id});
  res.render('sub_update', {data:data , id:id,sub_data:sub_data,data: data, title: 'Update Subcategory' });
});

router.get('/update_subcat_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await subcategory_db.findByIdAndUpdate( _id, {
      sub_category_name: req.query.sub_category_name,
      category_id: req.query.category_id,
    
    });
  res.redirect('/subcategory_list/');
});

router.get('/question/:id', async function(req,res, next){
  const data = await subcategory_db.findOne({'_id': req.params.id});
  console.log(data.form_created);
  res.render('question',{title:"Create Form", data: data});
})
router.get('/view_question/:subcat/:user', async function(req,res, next){                   ////////////////view Question

  const data = await subcategory_db.findById(req.params.subcat);
  const vehicle = await category_db.find({category_name:'Vehicles'});
  
  const yearData = new Date().getFullYear();
  const yearObj = [];
  for(var i = 0; i <= 15; i++){
      yearObj[i] = yearData - i; 
  }
  const brand = await brand_db.find({categoryId: data.category_id}).exec();
  if(data.category_id == vehicle[0]._id){
    console.log(vehicle[0]._id);
    //res.json({response: false, msg: 'Vehicle Form'});
    res.render('dynamic_form_view',{title:"View Form", id: data._id, data: data.question, 
    type: data.dataType, category: data, user: req.params.user,brand:brand,  yearObj: yearObj});
  }else{
    if(data.question == ''){
      //res.json({response: false, msg: 'Form not created'});
      res.render('/web_page/drop');
    }else if(brand != ''){
      res.render('dynamic_form_brand',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data, user: req.params.user, brand: brand});
    }else{
      res.render('dynamic_form',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data, user: req.params.user});
    }
  }
 
})

router.get('/view_question/:id', async function(req,res, next){                   ////////////////view Question
 
  const data = await subcategory_db.findOne({'_id': req.params.id});
  res.render('view_question',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data});
})

router.post('/submit_form/:id', async function(req, res, next){
  console.log(req.body.indicator);
 
    await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.extra,
        dataType: req.body.dataType
    },
      form_created: true
    })
    const data = await subcategory_db.findOne({'_id': req.params.id});
    res.render('view_question',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data});
})

router.post('/submit_add_more_form/:id', async function(req, res, next){
  console.log(req.body.indicator);
  
    await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.extra,
        dataType: req.body.dataType
      },
      form_created: true
    })
    const data = await subcategory_db.findById(req.params.id);
    res.render('add_more',{title:'Add More', data: data});
 
})
router.get('/add_more/:id', async function(req, res, next){
  const data = await subcategory_db.findById(req.params.id);
  res.render('add_more',{title:'Add More', data: data});
})


router.get('/add_more_one/:id/:extra', async function(req, res, next){

  console.log(req.params.extra);
   await subcategory_db.findByIdAndUpdate(req.params.id,{
    $push:{ 
      question: req.body.extra,
       dataType: req.body.dataType
      },
  });
  const data = await subcategory_db.findById(req.params.id);
  res.render('add_more',{title:'Add More', data: data});
})


router.post('/add_more_submit/:id', async function(req, res, next){
console.log(req.body.flag);
  await subcategory_db.findByIdAndUpdate(req.params.id,{
    $push:{ question: req.body.extra, dataType: req.body.dataType},
  });
  const data = await subcategory_db.findOne({'_id': req.params.id});
  console.log(data.question);
  res.render('view_question',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data});
});


router.post('/submit_dynamic_form/:id/:userId', upload.array('image', 5 ) , async function(req, res, next) {                          //category add
  console.log(req.params.id);
      const subcat_data = await subcategory_db.findById(req.params.id);
      const user = await user_db.findByIdAndUpdate( req.params.userId, {
                 $inc: {postCount: '1'} 
      } );
      let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/'
      let images = [];
      for(var i=0; i< req.files.length;i++){
        const url = baseUrl + req.files[i].filename;
        images[i] = {url};
      }
    
      const question = subcat_data.question;

      let value = [];
     // const extra_data = {};
      for(var i = 0; i < question.length;i++){
        const name = question[i];
        if(req.body[name] == null){
          value[i] = "";
        }else{
          value[i] = req.body[name];
        }
      // Object.entries({[`${question[i]}`]: req.body[name]}).forEach(([key,value]) => { extra_data[key] = value });
      };
      const category = await category_db.findById(subcat_data.category_id);
      console.log(user.added_on);
      const data = await product_db.create({
          category: category.category_name,
          subcategory: subcat_data.sub_category_name,
          description: req.body.description,
          user_id: user._id,
          user_name: user.name,
          created_on: moment(Date.now()).format("YYYY-MM-DD"),
          user_image: user.image,
          user_mobile: user.mobile,
          since: user.added_on,
          title:req.body.title,
          image: images,
          location: req.body.location,
          price: req.body.price,
          dataKey: question,
          dataValue: value,
         
         
      });
     console.log("hello");
     res.render('web_page/success',{ data: data});
    });

    router.post('/submit_dynamic_vehicle_form/:id/:userId', upload.array('image', 5 ) , async function(req, res, next) {                          //category add
      console.log(req.params.id);
          const subcat_data = await subcategory_db.findById(req.params.id);
          const user = await user_db.findByIdAndUpdate( req.params.userId, {
                     $inc: {postCount: '1'} 
          } );
          let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/'
          let images = [];
          for(var i=0; i< req.files.length;i++){
            const url = baseUrl + req.files[i].filename;
            images[i] = {url};
          }
        
          const question = subcat_data.question;
    
          let value = [];
         // const extra_data = {};
          for(var i = 0; i < question.length;i++){
            const name = question[i];
            if(req.body[name] == null){
              value[i] = "";
            }else{
              value[i] = req.body[name];
            }
            
           // Object.entries({[`${question[i]}`]: req.body[name]}).forEach(([key,value]) => { extra_data[key] = value });
          };
          const category = await category_db.findById(subcat_data.category_id);
          console.log(user.added_on);
          const data = await product_db.create({
              category: category.category_name,
              subcategory: subcat_data.sub_category_name,
              description: req.body.description,
              user_id: user._id,
              user_name: user.name,
              created_on: moment(Date.now()).format("YYYY-MM-DD"),
              user_image: user.image,
              user_mobile: user.mobile,
              since: user.added_on,
              title:req.body.title,
              year:req.body.year,
              brand: req.body.brand,
              image: images,
              location: req.body.location,
              price: req.body.price,
              dataKey: question,
              dataValue: value,
             
             
          });
         console.log("hello");
         res.render('web_page/success',{ data: data});
        });
//////////////////////////////////////////////////Pending

router.get('/pending',async function(req, res, next) {  
 
  const data = await product_db.find({ 'approval':false,'reject': false });                    
  res.render('pending', { title: 'Pending' , data: data, moment: moment});
});

router.get('/activate/:id', async function(req,res,next ){
  let _id = req.params.id;
  const a1= await product_db.findByIdAndUpdate( _id, {
    approval: true,
    approved_on: moment(Date.now()).format("YYYY-MM-DD"),
    });
   const data = await product_db.findById(_id);
   await user_db.updateMany({
    $set:{notification: []}
   });
    await user_db.updateMany({
    $push:{
      notification:{
        product_id: data._id,
        title: data.title,
        description: data.description,
        created_on: data.created_on
      }
    }

  });

  res.redirect('/products/');
});

router.get('/reject/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await product_db.findByIdAndUpdate( _id, {
    reject: true,
    approved_on: moment(Date.now()).format("YYYY-MM-DD"),
    });
  res.redirect('/pending/');
});
//////////////////////////////////////////////Products
router.get('/products',async function(req, res, next) {  
  const category = await category_db.find().exec();
  const subcategory = await subcategory_db.find().exec();
  const data = await product_db.find({'approval': true}).exec();                      
  res.render('products', { title: 'Products' , data: data, category: category, subcategory: subcategory, moment: moment});
});

router.get('/add_product',async function(req,res,next){                        //for Category TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();

  res.render('product_form',{title:'Add Vehicle', data: data, sub_data: sub_data});

});


router.get('/get_subcategory',async function(request, response, next){
  const type = request.query.type;
console.log(type);
  const search_query = request.query.parent_value;
console.log(search_query);
  if(type == 'load_subcategory') {
    var query =  await subcategory_db.find( { category_id: search_query },{sub_category_name: 1});
  }
 
  // let data_arr = [];
  // for(var i=0; i < ; i++){
  //   data_arr = query[i].sub_category_name;
  // }
  console.log(query);
    response.json(query);
  });


router.get('/update_product/:id', async function(req,res,next ){
  let id= req.params.id
  const sub_data = await product_db.find({'_id':id});
  const data = await category_db.find().exec();
  res.render('update_product', {data:data , id:id,sub_data: sub_data, title: 'Update Product' });
});

router.get('/view_product/:id', async function(req,res,next ){
  let id= req.params.id
  const data = await product_db.findById(id);
 
  res.render('view_product', {data:data , id:id, data: data, title: 'View Product' });
});

router.get('/update_product_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await product_db.findByIdAndUpdate( _id, {
    category: req.query.category,
    subcategory: req.query.subcategory,
    price: req.query.price,
    description: req.query.description,
    title:req.query.title,
    location: req.query.location,
    country: req.query.country,
    state: req.query.sts,
    city: req.query.city,
    pin:req.query.pin,
    brand: req.query.brand,
    longitude: req.query.longitude,
    latitude: req.query.latitude
    });
  res.redirect('/products/');
});
/////////////////////////////////////////properties
router.get('/properties',async function(req, res, next) {  
  const data = await properties_db.find().exec();                      
  res.render('properties', { title: 'Properties' , data: data, moment: moment});
});
router.get('/add_properties',async function(req,res,next){                        //for Category TAble Update

  const sub_data = await subcategory_db.find({category_id : '62e2422071d2a78f7b1373d9'}).exec();
  console.log(sub_data);
  res.render('properties_form',{title:'Add Properties', sub_data: sub_data});

});
// router.post('/add_properties_form', uploadProperties.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

//   await properties_db.create({
//       category: req.body.category,
//       image: req.files.image[0].filename,
//       subcategory: req.body.subcategory,
//       price: req.body.price,
//       description: req.body.description,
//       title:req.body.title,
//       location: req.body.location,
//       country: req.body.country,
//       state: req.body.sts,
//       city: req.body.city,
//       pin:req.body.pin,
//       area: req.body.area,
//       carpet_area: req.body.carpet_area,
//       facing: req.body.facing,
//       furnishing: req.body.furnishing,
//       construction: req.body.construction,
//       type: req.body.type,
//       bedroom: req.body.bedroom,
//       bathroom: req.body.bathroom,
//       owner: req.body.owner,

//   });
//   res.redirect('/properties/');
// });









/////////////////////////////////// update invoice


router.get('/invoice',async function(req,res,next){  
  const data = await admin_invoice.find().exec();
  console.log(data);
  res.render('web_page/admin_invoice',{data:data});
});

router.post('/update_invoice',upload.single('image'),async function(req,res,next){  
  const baseURL = 'http://belle-impex-360513.el.r.appspot.com/image/';
  const cat =  await admin_invoice.findById('63760a391936522581ffb903');
  const original = cat.image;
  const filename = original.replace('http://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(original);
  const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);
  await admin_invoice.findByIdAndUpdate('63760a391936522581ffb903',{
    company_name: req.body.company_name,
    location: req.body.location,
    email: req.body.email,
    mobile: req.body.mobile,
    image: baseURL + req.file.filename
  })
    res.redirect('/invoice/');
});
/////////////////////////////////////////vehicle
router.get('/vehicle',async function(req, res, next) {  
  const vehicleId = await category_db.find({category_name:'Vehicles'});
  console.log(vehicleId[0]._id)
  const data = await product_db.find({category: vehicleId[0]._id, approval: true}); 
  const brand =[];
  for(var i=0; i < data.length;i++){
     const name = await brand_db.find({'_id': data[i].brand});
     brand[i]= name[0].brand_name;
  };
   console.log(brand);                   
  res.render('vehicle', { title: 'Vehicle' , data: data,brand: brand, moment: moment });
});


router.get('/add_vehicle',async function(req,res,next){  
  const brand = await brand_db.find().exec();
  const year = await year_db.find().exec();
  const budget = await budget_db.find().exec();
  const data = await subcategory_db.find({category_id : "62e242cc71d2a78f7b1373e3"}).exec();
  console.log(data);
  res.render('vehicle_products_form',{title:'Add Vehicle', data: data,  brand: brand, years: year, budget: budget});

});

// router.post('/add_vehicle_form', uploadVehicle.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

//   await vehicle_db.create({
    
//       image: req.files.image[0].filename,
//       subcategory: req.body.subcategory,
//       price: req.body.price,
//       description: req.body.description,
//       title:req.body.title,
//       km:req.body.km,
//       year:req.body.year,
//       fuel:req.body.fuel,
//       location: req.body.location,
//       country: req.body.country,
//       state: req.body.stt,
//       city: req.body.city,
//       pin:req.body.pin,
//       brand: req.body.brand,
//       insurance: req.body.insurance

//   });
//   res.redirect('/vehicle/');
// });

router.get('/update_vehicle/:id', async function(req,res,next ){
  let id= req.params.id
  const data = await vehicle_db.find({'_id':id});
  const subcategory = await subcategory_db.find({category_id : '62e242cc71d2a78f7b1373e3'}).exec();
  const brand = await brand_db.find().exec();
  const year = await year_db.find().exec();
  const budget = await budget_db.find().exec();
  res.render('update_vehicle', { data:data , id:id , subcategory: subcategory, brand: brand, years: year, budget: budget , title: 'Update Product' });
});
router.get('/update_vehicle_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await vehicle_db.findByIdAndUpdate( _id, {
    
      subcategory: req.query.subcategory,
      price: req.query.price,
      description: req.query.description,
      title:req.query.title,
      km:req.query.km,
      year:req.query.year,
      fuel:req.query.fuel,
      location: req.query.location,
      country: req.query.country,
      state: req.query.stt,
      city: req.query.city,
      pin:req.query.pin,
      brand: req.query.brand,
      insurance: req.query.insurance
    });
  res.redirect('/vehicle/');
});

///////////////////////////////admin Login
router.post('/save', async function(req, res, next) {
 
  try{
    const user = await admin_db.findOne({username:req.body.email,password:req.body.password});
   console.log(user);
    if(user.username === req.body.email && user.password === req.body.password  ){
      console.log('if condi');
      res.redirect('/index/');
    }
 else if(user.username === req.body.email || user.password === req.body.password  ){
  console.log('else if condi');
  res.render('login',{ title: '* Wrong Credentials', msg:'Incorrect Password!!'});
    }else{
      // sessionVar=req.session;
      // sessionVar.userdetail=user;
      // sessionVar.save();
      // console.log('After Save : ',sessionVar);
      console.log('else condi');
      res.render('login',{ title: 'Empty Fields', msg:'Incorrect Password!!'});
     
    }
  }catch(err){
   console.log(err);
   console.log('catch');
   res.render('login',{ title: '* Wrong Credentials', msg:'Incorrect Password!!'});
  
  }
});

/////////////////////////////////////////delete
router.get('/delete_subcat/:id', async function(req,res,next ){
  let id= req.params.id;
  await subcategory_db.deleteOne({ _id:id});

  res.redirect('/subcategory_list/');

});

router.get('/delete_subscription/:id', async function(req,res,next ){
  let id= req.params.id;
  await subscription_db.deleteOne({ _id:id});

  res.redirect('/subscription/');

});

router.get('/delete_cat/:id', async function(req,res,next ){
  let id= req.params.id;
  const cat =  await category_db.findById(id);
  const original = cat.image;
  const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(filename);
  const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);
  await category_db.deleteOne({ _id:id});
  await subcategory_db.deleteMany({category_id: id});
  res.redirect('/category/');

});

router.get('/delete_noti/:id', async function(req,res,next ){
  let id= req.params.id;
  await noti_db.deleteOne({ _id:id});

  res.redirect('/notification/');

});

router.get('/delete_ban/:id', async function(req,res,next ){
  let id= req.params.id;
  const cat =  await banner_db.findById(id);
  const original = cat.image;
  const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(filename);
  await gfs.files.deleteOne({filename: filename}); const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);
  await banner_db.deleteOne({ _id:id});
  res.redirect('/banner_list/');

});

router.get('/delete_brand/:id', async function(req,res,next ){
  let id= req.params.id;
  const cat =  await brand_db.findById(id);
  const original = cat.image;
  const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
  console.log(filename);
  const file = await gfs.files.findOne({filename: filename});
  await gridfsBucket.delete(file._id);
  await brand_db.deleteOne({ _id:id});
  if(req.params.id == '6353f6905398c68d20628eaf'){
    res.redirect('/brand/');
  }else{
    res.redirect('/category/');
  }

});
///////////////////////////////testing router

router.get('/delete_year/:id', async function(req,res,next ){
  let id= req.params.id;
  await year_db.deleteOne({ _id:id});

  res.redirect('/year/');

});
router.get('/delete_budget/:id', async function(req,res,next ){
  let id= req.params.id;
  await budget_db.deleteOne({ _id:id});

  res.redirect('/budget/');

});
router.get('/delete_product/:id', async function(req,res,next ){
  let id= req.params.id;
  const cat =  await product_db.findById(id);
  for(var i = 0; i< cat.image.length;i++){
    const original = cat.image[i].url;
    const filename = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filename);
    const file = await gfs.files.findOne({filename: filename});
    await gridfsBucket.delete(file._id);
  }
  await product_db.deleteOne({ _id:id});

  res.redirect('/products/');

});

router.get('/delete_question/:id', async function(req,res,next ){
  let id= req.params.id;
  await subcategory_db.findByIdAndUpdate({ _id:id}, { $unset: {question:"", dataType:""},
  form_created: false
  });
  res.redirect('/subcategory_list/');

});

router.get('/delete_state/:id', async function(req,res,next ){
  let id= req.params.id;
  await state_db.deleteOne({ _id:id});
  await city_db.deleteMany({state_id: id})
  res.redirect('/viewState/');

});

module.exports = router;