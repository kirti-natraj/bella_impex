const express = require('express');
const router = express.Router();
const brand_db = require('../models/brand');
const multer = require("multer");
// const moment = require("moment");
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, imageBaseDir+'data/employee_img');
//     },
//     filename: function (req, file, cb) {
//         let extArray = file.mimetype.split("/");
//         let extension = extArray[extArray.length - 1];
//         cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
//     }
// });


router.get('/brand',async function(req,res,next){                        //for UserTable Page
    const data = await brand_db.find().exec();
    
    res.render('brand',{title:'Brand Table',data : data});
  
  
  });



module.exports = router;