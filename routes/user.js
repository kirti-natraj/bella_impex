const express = require('express');
const router = express.Router();

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


router.get('/',async function(req,res,next){                        //for UserTable Page
    const data = await user_db.find().exec();
    
    res.render('user',{title:'User Table',data : data});
  
  
  });



module.exports = router;