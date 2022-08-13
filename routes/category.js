const express = require('express');
const router = express.Router();
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
const multer = require("multer");
const moment = require("moment");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageBaseDir+'data/employee_img');
    },
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
});
const upload = multer({storage: storage});

router.get('/category',async function(req,res,next){                        
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
  

  module.exports = router;