const express = require('express');
const router = express.Router();

const multer = require("multer");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/vehicle/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const upload= multer({storage: storage});

  /////////////////////////////////////////vehicle
router.get('/vehicle',async function(req, res, next) {  
    const data = await vehicle_db.find().exec();                      
    res.render('vehicle', { title: 'Vehicle' , data: data, moment: moment });
  });
  
  
  router.get('/add_vehicle',async function(req,res,next){  
    const cat = await category_db.findOne({category_name: 'Vehicles'}); 
                      //for Category TAble Update
    const data = await subcategory_db.find().exec();
    const sub_data = await product_db.find().exec();
    res.render('vehicle_products_form',{title:'Add Vehicle', data: data, sub_data: sub_data, cat: cat});
  
  });
  
  router.post('/add_vehicle_form', upload.fields([{name:'image', maxCount: 1}]), async function(req, res, next) {                          //category add
  
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
        state: req.body.sts,
        city: req.body.city,
        pin:req.body.pin,
        brand: req.body.brand
  
    });
    res.redirect('/vehicle/');
  });

  module.exports = router;