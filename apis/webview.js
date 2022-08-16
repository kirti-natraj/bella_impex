var express = require('express');
var router = express.Router();
const vehicle_db = require('../models/vehicle');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const multer = require('multer');
const cors = require('cors')
const storageVehicle = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/vehicle/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const uploadVehicle= multer({storage: storageVehicle});
router.get('/', async function (req, res) {
    const brand = await brand_db.find().exec();
    res.render('web_page/index',{brand:brand});

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

router.post('/add_vehicle',async function(req, res, next) {                          //category add

    const data = await vehicle_db.create({
      
        subcategory: 'Cars',
        description: req.body.description,
        title:req.body.title,
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
    res.render('web_page/drop',{id: req.params.id});
  });
  router.post('/add_drop/:id',uploadVehicle.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add
// console.log(req.files);
//     await vehicle_db.findByIdAndUpdate(req.params.id, {
//       image: req.files.image
  
//     });
    res.render('web_page/location');
  });
  

module.exports = router;