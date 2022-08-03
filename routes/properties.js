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


const storageProperties = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/properties/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const uploadProperties = multer({storage: storageProperties});

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

  module.exports = router;

