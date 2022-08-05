var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');


const moment = require('moment');

const multer = require('multer');
const cors = require('cors')
const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/category/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
});
const upload = multer({storage: storage});

const storageVehicle = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/assets/images/vehicle/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now()+ '__' + file.originalname);
  }
});
const uploadVehicle= multer({storage: storageVehicle});

const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/assets/images/product/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now()+ '__' + file.originalname);
  }
});
const uploadProduct = multer({storage: storageProduct});

const storageProperties = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/assets/images/properties/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now()+ '__' + file.originalname);
  }
});
const uploadProperties = multer({storage: storageProperties});

const storageBrand = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/assets/images/brand/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now()+ '__' + file.originalname);
  }
});
const uploadBrand = multer({storage: storageBrand});
/* GET home page. */
router.get('/',  function(req, res, next) {    
              //for login Page
  res.render('login', { title: '' });
});

///////////////////////////////////////brand
router.get('/brand',async function(req,res,next){                        //for UserTable Page
  const data = await brand_db.find().exec();
  
  res.render('brand',{title:'Brand Table',data : data});


});
router.get('/brand_form',async function(req,res,next){                        //for Category TAble Update
 
  res.render('brand_form',{title:'Add Brand'});

});


router.post('/add_brand_form', uploadBrand.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

  await brand_db.create({
      brand_name: req.body.brand_name,
      image: req.files.image[0].filename
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
 
  res.render('category',{title:'Category List',data : data});


});

router.get('/add_category',async function(req,res,next){                        //for Category TAble Update
 
  res.render('add_category',{title:'Add Category'});

});


router.post('/add_category_form', upload.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

  await category_db.create({
      category_name: req.body.category_name,
      image: req.files.image[0].filename
  });
  res.redirect('/category/');
});

router.get('/update_category/:id', async function(req,res,next ){
  let id= req.params.id
  const data = await category_db.find({'_id':id});
  
  res.render('category_update', {data:data , id:id,title: 'Update Category' });
});

router.get('/update_cat_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await category_db.findByIdAndUpdate( _id, {
      category_name: req.query.category_name,
    
    });
  res.redirect('/category/');
});

//////////////////////////////////////subcat

router.get('/add_subcategory/:id',async function(req,res,next){                        //for Category TAble Update
  let _id = req.params.id;
  const category_name = await category_db.findById(_id);
  res.render('add_subcategory',{title:'Add Subcategory', id: _id, category_name: category_name});

});

router.get('/subcategory_list',async function(req,res,next){                        //for SubCategory TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();
  res.render('subcategory_list',{title:'Subcategory List', data: data, sub_data: sub_data, moment: moment});

});


router.post('/subcategory_form/:id', async function(req,res,next ){                          //for updating subcategory info
  let _id = req.params.id;
  await subcategory_db.create({
      sub_category_name: req.body.sub_category_name,
      created_on: Date.now(),
      category_id: _id,
  });
 
  res.redirect('/subcategory_list/');
});


router.get('/update_subcat/:id', async function(req,res,next ){
  let id= req.params.id
  const sub_data = await subcategory_db.find({'_id':id});
  const data = await category_db.find().exec();
  res.render('sub_update', {data:data , id:id,sub_data:sub_data, title: 'Update Subcategory' });
});

router.get('/update_subcat_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await subcategory_db.findByIdAndUpdate( _id, {
      sub_category_name: req.query.sub_category_name,
      category_id: req.query.category_id,
    
    });
  res.redirect('/subcategory_list/');
});

//////////////////////////////////////////////Products
router.get('/products',async function(req, res, next) {  
  const data = await product_db.find().exec();                      
  res.render('products', { title: 'Products' , data: data, moment: moment});
});

router.get('/add_product',async function(req,res,next){                        //for Category TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();
  res.render('product_form',{title:'Add Vehicle', data: data, sub_data: sub_data});

});

router.post('/add_product_form', uploadProduct.fields({name: 'image', maxCount: 5}), async function(req, res, next) {                          //category add
  await product_db.create({
      category: req.body.category,
      image :req.files.image.filename,
      subcategory: req.body.subcategory,
      price: req.body.price,
      description: req.body.description,
      title:req.body.title,
      location: req.body.location,
      country: req.body.country,
      state: req.body.stt,
      city: req.body.city,
      pin:req.body.pin,
      brand: req.body.brand,
      longitude: req.body.longitude,
      latitude: req.body.latitude


  });
  res.redirect('/products/');
});

router.get('/update_product/:id', async function(req,res,next ){
  let id= req.params.id
  const sub_data = await product_db.find({'_id':id});
  const data = await category_db.find().exec();
  res.render('update_product', {data:data , id:id,sub_data:sub_data, title: 'Update Product' });
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
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();
  res.render('properties_form',{title:'Add Properties', data: data, sub_data: sub_data});

});

router.post('/add_properties_form', uploadProperties.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

  await properties_db.create({
      category: req.body.category,
      image: req.files.image[0].filename,
      subcategory: req.body.subcategory,
      price: req.body.price,
      description: req.body.description,
      title:req.body.title,
      location: req.body.location,
      country: req.body.country,
      state: req.body.sts,
      city: req.body.city,
      pin:req.body.pin,
      area: req.body.area,
      carpet_area: req.body.carpet_area,
      facing: req.body.facing,
      furnishing: req.body.furnishing,
      construction: req.body.construction,
      type: req.body.type,
      bedroom: req.body.bedroom,
      bathroom: req.body.bathroom,
      owner: req.body.owner,

  });
  res.redirect('/properties/');
});
/////////////////////////////////////////vehicle
router.get('/vehicle',async function(req, res, next) {  
  const data = await vehicle_db.find().exec();                      
  res.render('vehicle', { title: 'Vehicle' , data: data, moment: moment });
});


router.get('/add_vehicle',async function(req,res,next){  
  const brand = await brand_db.find().exec();
  const year = await year_db.find().exec();
  const budget = await budget_db.find().exec();
  const data = await subcategory_db.find({category_id : '62e242cc71d2a78f7b1373e3'}).exec();
  res.render('vehicle_products_form',{title:'Add Vehicle', data: data,  brand: brand, years: year, budget: budget});

});

router.post('/add_vehicle_form', uploadVehicle.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add

  await vehicle_db.create({
    
      image: req.files.image[0].filename,
      subcategory: req.body.subcategory,
      price: req.body.price,
      description: req.body.description,
      title:req.body.title,
      km:req.body.km,
      year:req.body.year,
      fuel:req.body.fuel,
      location: req.body.location,
      country: req.body.country,
      state: req.body.stt,
      city: req.body.city,
      pin:req.body.pin,
      brand: req.body.brand,
      insurance: req.body.insurance

  });
  res.redirect('/vehicle/');
});

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
module.exports = router;