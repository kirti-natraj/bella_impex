var express = require('express');
var router = express.Router();
const vehicle_db = require('../models/vehicle');
const user_db = require('../models/user');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const state_db = require('../models/state');
const city_db = require('../models/city');
const moment = require('moment');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const cors = require('cors')
const app = express();
app.use(cors());
const mongoURI = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
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
  
router.get('/:id', async function (req, res) {
    console.log(req.params.id);
    const yearData = new Date().getFullYear();
    const yearObj = [];
    for(var i = 0; i <= 15; i++){
        yearObj[i] = yearData - i; 
    }
    const brand = await brand_db.find().exec();
    const user = await user_db.findOne({ '_id': req.params.id });
    res.render('web_page/index',{brand:brand, user: user,  yearObj: yearObj});
});

router.get('/price', function (req, res) {
    res.render('web_page/price');

});

router.get('/drop', function (req, res) {
    res.render('web_page/drop');

});

router.get('/location',async function (req, res) {
    const state = await state_db.find().exec();
    const city = await city_db.find().exec();
        res.render('web_page/location', {state: state, city: city});

});

router.post('/add_vehicle/:id', upload.array('image', 5 ) , async function(req, res, next) {                          //category add
console.log(req.params.id);
    const user = await user_db.findByIdAndUpdate( req.params.id, {
               $inc: {postCount: '1'} 
    } );
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/'
    let images = [];
    for(var i=0; i< req.files.length;i++){
      images[i] = baseUrl + req.files[i].filename;
    }
    console.log(images);
    const data = await vehicle_db.create({
      
        subcategory: 'Cars',
        description: req.body.description,
        user_id: user._id,
        user_name: user.name,
        user_image: user.image,
        user_mobile: user.mobile,
        since: user.added_on,
        title:req.body.title,
        created_on: moment(Date.now()).format("YYYY-MM-DD"),
        km:req.body.km,
        year:req.body.year,
        image: images,
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
    const state = await state_db.find().exec();
    const city = await city_db.find().exec();
    await vehicle_db.findByIdAndUpdate(req.params.id, {
      price: req.body.price
  
    });
    res.render('web_page/location',{id: req.params.id, state: state, city: city});
  });

 
  router.post('/add_location/:id', async function(req, res, next) {                          //category add

     await vehicle_db.findByIdAndUpdate(req.params.id, {
      state: req.body.stt,
      city: req.body.city
    
    });
    const data = await vehicle_db.findOne({_id: req.params.id});
    const brand = await brand_db.findById( data.brand);
    console.log(brand.brand_name);
    res.render('web_page/form_field',{ data: data, brand: brand});
  
  });
  

module.exports = router;