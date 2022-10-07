var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const noti_db = require('../models/noti');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const banner_db = require('../models/banner');
const state_db = require('../models/state');
const city_db = require('../models/city');
const moment = require('moment');
const cors = require('cors')
const app = express();
app.use(cors());

var FCM = require('fcm-node');

//////////////////////////////

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
////////////////////////////////////////////////
//mongodb    connection 
//////////////////////////////////////////

/* GET home page. */
router.get('/',  function(req, res, next) {    
              //for login Page
  res.render('login', { title: '' });
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
  const data = await brand_db.find().exec();
  
  res.render('brand',{title:'Brand Table',data : data});


});
router.get('/brand_form',async function(req,res,next){                        //for Category TAble Update
 
  res.render('brand_form',{title:'Add Brand'});

});


router.post('/add_brand_form', upload.single('image'), async function(req, res, next) {                          //category add
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
  await brand_db.create({
      brand_name: req.body.brand_name,
      image: baseUrl+req.file.filename
  });
  res.redirect('/brand/');
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
  const data = await budget_db.find().exec();
  
  res.render('budget',{title:'Budget Table',data : data});


});
router.get('/budget_form',async function(req,res,next){                        //for Category TAble Update
 
  res.render('budget_form',{title:'Add Budget'});

});


router.post('/add_budget_form',  async function(req, res, next) {                          //category add

  await budget_db.create({
      budget: req.body.budget
  });
  res.redirect('/budget/');
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

router.post('/add_banner', upload.single('image'), async function(req, res, next) {                          //category add
  let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
  await banner_db.create({
     
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
///////////////////////////////////////////////category
router.get('/category',async function(req,res,next){                        //for UserTable Page
      const data = await category_db.find().exec();
 
      res.render('category',{title:'Category List',data : data,  moment: moment});
  
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
    msg: '---->  '+req.body.category_name+'added'
  })
  res.redirect('/category/');

});

router.get('/update_category/:id', async function(req,res,next ){
  let id= req.params.id
  const data = await category_db.find({'_id':id});
  
  res.render('category_update', {data:data , id:id,title: 'Update Category' });
});

// router.get('/update_cat_form/:id', upload.fields([{name:'image', maxCount: 1}]), async function(req,res,next ){
//   let _id = req.params.id;
//   console.log(req.files);

//     const a1= await category_db.findByIdAndUpdate( _id, {
//       category_name: req.query.category_name,
   
//     });
 
  
//   res.redirect('/category/');
// });

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

/////////////////////////////////////////////////// Forms

// router.get('/forms',async function(req,res,next){                        
//   const data = await category_db.find().exec();
//   const sub_data = await subcategory_db.find().exec();
//   res.render('forms',{title:'Forms', data: data, sub_data: sub_data, moment: moment});

// });

// router.get('/create_form/:id', async function(req, res, next){
 
//    res.render('create_form',{title:'Create Form', data: req.params.id });
// })

// router.post('/created_form/:id',async function(req,res,next){  
//   const brand = await brand_db.find().exec();
//   const year = await year_db.find().exec();
//   const budget = await budget_db.find().exec();
//   console.log(req.body.KM);
//   const km = req.body.KM;
//   await subcategory_db.findByIdAndUpdate(req.params.id,{
//              km: km,
//              fuel: req.body.FUEL,
//              form_created: true
//   });
//   const data = await subcategory_db.find({'_id': req.params.id});
//   const cat = await category_db.find({'_id': data[0].category_id}).exec();
//   console.log(data);
//   res.render('created_form',{title:'Created Form', data: data,  brand: brand, years: year,cat:cat, budget: budget});

// });

// router.get('/View_forms',async function(req,res,next){                        //for SubCategory TAble Update
//   const data = await category_db.find().exec();
//   const sub_data = await subcategory_db.find().exec();
//   res.render('View_forms',{title:'View Forms', data: data, sub_data: sub_data, moment: moment});
// });

// router.get('/view_form/:id',async function(req,res,next){  
//   const brand = await brand_db.find().exec();
//   const year = await year_db.find().exec();
//   const budget = await budget_db.find().exec();
//   const data = await subcategory_db.find({'_id': req.params.id});
//   const cat = await category_db.find({'_id': data[0].category_id}).exec();
//   console.log(data);
//   res.render('view_form',{title:'Created Form', data: data,  brand: brand, years: year,cat:cat, budget: budget});
// });

router.get('/question/:id', async function(req,res, next){
  const data = await subcategory_db.findOne({'_id': req.params.id});
  console.log(data.form_created);
  res.render('question',{title:"Create Form", data: data});
})
router.get('/view_question/:subcat/:user', async function(req,res, next){                   ////////////////view Question
  const data = await subcategory_db.findOne({'_id': req.params.subcat});
  console.log(data.question);
  res.render('dynamic_form',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data, user: req.params.user});
})

router.get('/view_question/:id', async function(req,res, next){                   ////////////////view Question
 
  const data = await subcategory_db.findOne({'_id': req.params.id});
  console.log(data.question);
  res.render('dynamic_form_view',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data});
})
router.post('/submit_form/:id', async function(req, res, next){
  console.log(req.body.indicator);
  if(req.body.indicator == 'yes'){
    await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.first,
      dataType: req.body.firstType},
      form_created: true
    })
     await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
      question: req.body.second,
       dataType: req.body.secondType},
      
    })
    const data = await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{
         question: req.body.third,
         dataType: req.body.thirdType},
     
    })
    res.render('dynamic_form_view',{title:"View Form", id: data._id, data: data.question, type: data.dataType, category: data});
  }else{
    await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.first,
        dataType: req.body.firstType},
      form_created: true
    })
     await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.second,
        dataType: req.body.secondType},
      
    })
    await subcategory_db.findByIdAndUpdate(req.params.id,{
      $push:{ 
        question: req.body.third,
        dataType: req.body.thirdType},
     
    })
    const data = await subcategory_db.findById(req.params.id);
    res.render('add_more',{title:'Add More', data: data});
  }
})

router.get('/add_more/:id', async function(req, res, next){
  const data = await subcategory_db.findById(req.params.id);
  res.render('add_more',{title:'Add More', data: data});
})
router.get('/add_more_one/:id', async function(req, res, next){
   await subcategory_db.findByIdAndUpdate(req.params.id,{
    $push:{ question: req.body.extra, dataType: req.body.dataType},
  });
  const data = await subcategory_db.findById(req.params.id);
  res.render('add_more',{title:'Add More', data: data});
})
router.post('/add_more_submit/:id', async function(req, res, next){

  await subcategory_db.findByIdAndUpdate(req.params.id,{
    $push:{ question: req.body.extra, dataType: req.body.dataType},
  });
  const data = await subcategory_db.findById(req.params.id);
  res.render('dynamic_form_view',{title:"View Form", id: data._id, data: data.question,category: data.sub_category_name, type: data.dataType});
  
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
        images[i] = baseUrl + req.files[i].filename;
      }
      console.log(images);
      const question = subcat_data.question;
      const extra_data = {};
      for(var i = 0; i < question.length;i++){
        const name = question[i];
        Object.entries({[`${question[i]}`]: req.body[name]}).forEach(([key,value]) => { extra_data[key] = value })
      };
      console.log(extra_data);
      const data = await product_db.create({
          category: subcat_data.category_id,
          subcategory: subcat_data.sub_category_name,
          description: req.body.description,
          user_id: user._id,
          user_name: user.name,
          user_image: user.image,
          user_mobile: user.mobile,
          since: user.added_on,
          title:req.body.title,
          image: images,
          extra_data: extra_data,
          created_on: moment(Date.now()).format("YYYY-MM-DD"),
         
      });
    
      res.render('web_page/price',{id: data._id});
    });
//////////////////////////////////////////////////Pending

router.get('/pending',async function(req, res, next) {  
 
  const data = await vehicle_db.find({'approval': false, 'reject': false}).exec();                      
  res.render('pending', { title: 'Pending' , data: data, moment: moment});
});

router.get('/activate/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await vehicle_db.findByIdAndUpdate( _id, {
    approval: true,
    approved_on: moment(Date.now()).format("YYYY-MM-DD"),
    });
   const data = await vehicle_db.findById(_id);
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

    var message = {
      to: "ci9arx8Mizk:APA91bFiMGRQIs-glSL6hZfRXCumXBDuGL1LXRoYj-7jY6kPesrAxXy7KaOlbvYTWJllj1tqKSl7XuxbHBErOU-s_z45abHma6Zttm8HjXX_f1tNFNNuP0U9y-RWWieFZkiLt5kJGFDU",
          notification: {
              title: 'NotifcatioTestAPP',
              body: '{"Message from node js app"}',
          },
      
          data: { //you can send only notification or only data(or include both)
              title: 'ok cdfsdsdfsd',
              body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}'
          }
      
      };
      
      fcm.send(message, function(err, response) {
          if (err) {
              console.log("Something has gone wrong!"+err);
              console.log("Respponse:! "+response);
          } else {
              // showToast("Successfully sent with response");
              console.log("Successfully sent with response: ", response);
          }
      
     




    })
  res.redirect('/vehicle/');
});

router.get('/reject/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await vehicle_db.findByIdAndUpdate( _id, {
    reject: true,
    approved_on: moment(Date.now()).format("YYYY-MM-DD"),
    });
  res.redirect('/pending/');
});
//////////////////////////////////////////////Products
router.get('/products',async function(req, res, next) {  
  const category = await category_db.find().exec();
  const subcategory = await subcategory_db.find().exec();
  const data = await product_db.find().exec();                      
  res.render('products', { title: 'Products' , data: data, category: category, subcategory: subcategory, moment: moment});
});

router.get('/add_product',async function(req,res,next){                        //for Category TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();

  res.render('product_form',{title:'Add Vehicle', data: data, sub_data: sub_data});

});

// router.post('/add_product_form', uploadProduct.fields([{name:'image', maxCount: 5}]), async function(req, res, next) {                          //category add
//   const data = await category_db.find({'_id': req.body.category});
//   const sub_data = await subcategory_db.find({'_id': req.body.subcategory});
//   console.log(req.files.image);

//   await product_db.create({
//       category: req.body.category,
//       subcategory: req.body.subcategory,
//       category_name: data[0].category_name,
//       subcategory_name: sub_data[0].sub_category_name,
//       image: req.files.image,
//       price: req.body.price,
//       date: Date.now(),
//       description: req.body.description,
//       title:req.body.title,
//       location: req.body.location,
//       country: req.body.country,
//       state: req.body.stt,
//       city: req.body.city,
//       pin:req.body.pin,
//       longitude: req.body.longitude,
//       latitude: req.body.latitude

//   });
//   res.redirect('/products/');
// });


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
/////////////////////////////////////////vehicle
router.get('/vehicle',async function(req, res, next) {  
  const data = await vehicle_db.find({'approval': true}).exec();                      
  res.render('vehicle', { title: 'Vehicle' , data: data, moment: moment });
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

router.get('/delete_cat/:id', async function(req,res,next ){
  let id= req.params.id;
  await category_db.deleteOne({ _id:id});

  res.redirect('/category/');

});
router.get('/delete_brand/:id', async function(req,res,next ){
  let id= req.params.id;
  await brand_db.deleteOne({ _id:id});

  res.redirect('/brand/');

});
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
  await product_db.deleteOne({ _id:id});

  res.redirect('/products/');

});

router.get('/delete_question/:id', async function(req,res,next ){
  let id= req.params.id;
  await subcategory_db.findByIdAndUpdate({ _id:id}, {$unset: {question:1},
  form_created: false
  }, {multi:true});
  res.redirect('/subcategory_list/');

});
module.exports = router;