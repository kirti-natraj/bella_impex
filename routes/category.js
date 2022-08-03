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
  module.exports = router;