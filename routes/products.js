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


const storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/product/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const uploadProduct = multer({storage: storageProduct});

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
  
  router.post('/add_product_form', uploadProduct.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add
  
    await product_db.create({
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
  module.exports = router;

