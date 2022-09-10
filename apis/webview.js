var express = require('express');
var router = express.Router();
const alert = require('node-popup');
const vehicle_db = require('../models/vehicle');
const user_db = require('../models/user');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const moment = require('moment');


const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const s3 = new aws.S3({ accessKeyId: "***", secretAccessKey: "***" });
const cors = require('cors')
const app = express();
app.use(cors());
const storageVehicle = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/vehicles/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const uploadVehicle= multer({storage: storageVehicle});
  
router.get('/:id', async function (req, res) {
    console.log(req.params.id);
    const brand = await brand_db.find().exec();
    const user = await user_db.findOne({ '_id': req.params.id });
    res.render('web_page/index',{brand:brand, user: user});
});

router.get('/price', function (req, res) {
    res.render('web_page/price');

});

router.get('/drop', function (req, res) {
    res.render('web_page/drop');

});

router.get('/location', function (req, res) {
    res.render('web_page/location');

});

router.post('/add_vehicle/:id',uploadVehicle.fields([{name:'image', maxCount: 5}]), async function(req, res, next) {                          //category add
console.log(req.params.id);
    const user = await user_db.findByIdAndUpdate( req.params.id, {
               $inc: {postCount: '1'} 
    } );
    console.log(user);

    const data = await vehicle_db.create({
      
        subcategory: 'Cars',
        description: req.body.description,
        user_id: user._id,
        user_name: user.name,
        user_image: user.image,
        user_mobile: user.mobile,
        since: user.added_on,
        image: req.files.image,
        title:req.body.title,
        date: moment(Date.now()).format("YYYY-MM-DD"),
        km:req.body.km,
        year:req.body.year,
        fuel:req.body.fuel,
        owner: req.body.owner,
        brand: req.body.brand,
        insurance_type: req.body.insurance_type,
        insurance_valid: req.body.insurance_valid,
        transmission: req.body.transmission
  
    });
    res.render('web_page/price',{id: data._id});
  });
  
  router.post('/add_price/:id',async function(req, res, next) {                          //category add

    await vehicle_db.findByIdAndUpdate(req.params.id, {
      price: req.body.price
  
    });
    res.render('web_page/location',{id: req.params.id});
  });

  //  router.post('/add_drop/:id',uploadVehicle.fields([{name:'image', maxCount: 5}]), async function(req, res, next) {                          //category add
  
  //   await vehicle_db.findByIdAndUpdate(req.params.id, {
  // image: req.files
  
  //  });
  //   res.render('',{id: req.params.id});
  // });

  router.post('/add_location/:id',async function(req, res, next) {                          //category add

    await vehicle_db.findByIdAndUpdate(req.params.id, {
      state: req.body.stt,
      city: req.body.city,
      location: req.body.location,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    });
    res.render('web_page/success',{title:"popup"} );
  });
  

module.exports = router;