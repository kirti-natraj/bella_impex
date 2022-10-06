var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const state_db = require('../models/state');
const city_db = require('../models/city');
const moment = require('moment');
const multer = require('multer');
const puppeteer = require('puppeteer');
var user_bill_db = require('../models/user_billing');




const storageProduct = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/products/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ '__' + file.originalname);
    }
  });
  const uploadProduct = multer({storage: storageProduct});


router.post('/addProduct', uploadProduct.fields([{name:'image', maxCount: 5}]), async function(req, res, next) {                          //category add
   
    const value = Date.Now();
    const data = await category_db.find({'_id': req.body.category});
    const sub_data = await subcategory_db.find({'_id': req.body.subcategory});
    const user =  await product_db.create({
        category: req.body.category,
        subcategory: req.body.subcategory,
        category_name: data[0].category_name,
        subcategory_name: sub_data[0].sub_category_name,
        image: req.files.image,
        price: req.body.price,
        date: value.format('yyyy-mm-dd'),
        description: req.body.description,
        title:req.body.title,
        location: req.body.location,
        country: req.body.country,
        state: req.body.stt,
        city: req.body.city,
        pin:req.body.pin,
        longitude: req.body.longitude,
        latitude: req.body.latitude
  
    });
    user.save()
    .then(result => {
        res.status(200).json({
            response: true,
            msg: "Product Added Successfully",
            data: result
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
  });
 /////////// getProduct
 router.post('/getProduct',async function (req, res, next) {

    const sub_id =  req.body.subcategory;
  
    console.log(sub_id)
    const data = await product_db.find({subcategory: sub_id});
  
       
        return res.json({response: false, msg:"Data found", data: data })
    
 

}); 
//////////////////////////////////////getVehicle
router.post('/getVehicle',async function (req, res, next) {

    const cat =  req.body.category;
   
    const data = await vehicle_db.find({category: cat, approval: true});
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
        console.log(data)
        
     const user = req.body.user_id;
     const user_data = await user_db.findById(user);
     console.log(user_data);
     for(var j=0; j < data.length; j++)
     {
        for(var i=0;i < user_data.liked_post_id.length ;i++){
            console.log(data[j]);
            if(user_data.liked_post_id[i] == data[j]._id){
                data[j].likeFlag = true
            }
        }
     }
    
        res.json({ response: true , msg: "Data Found", data: data });
    } 
   

}); 
///////////////////////////////////////state and city

router.get('/getState',async function (req, res, next) {
   const data = await state_db.find().exec();
   return res.json({response: true, msg:"Page found", data: data })
});

router.post('/getCity',async function (req, res, next) {
    city_db.find({state_id: req.body.state_id})
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
            result.fcmToken = req.body.fcmToken;
            return res.json({response: true, msg:"User found", data: result});
        }
    })
});

////////////////////////////////////////////webview of add vehicle post

  router.get('/getWebviewData',async function (req, res, next) {
     
        const data = "https://belle-impex-360513.el.r.appspot.com/webviewIndex";
        return res.json({response: true, msg:"Page found", data: data })
       
});


router.post('/getPDF',async function (req, res, next) {
     
    const data = "https://belle-impex-360513.el.r.appspot.com/assets/images/result.pdf";
    return res.json({response: true, msg:"PDF found", data: data, user_id: req.body.user_id, invoiceNo: '218y63981ksdjbfskj',price:'20,000/-', date: '22/09/22' })
   
});
router.post('/checkSubscription',async function (req, res, next) {
          

    
    user_db.findById(req.body.userId)
    .then(result => {
        if(result.postCount >= 1) 
    {
         if(result.payment == true) 
         {
            
         res.json({response: true, msg:"Subcription Taken", remainingDays: '15'  })
         }
         else
         {
            
         res.json({response: false, msg:"Subscription not taken" })
         }
       
    }    
    else
    { 
        return res.json({response: true, msg:"Subscription Taken" })
    } 
    })      
   
});

router.post('/subscriptionPlan',async function (req, res, next) {
     
    var user = await user_db.findByIdAndUpdate(req.body.userId, {
        payment: true,
        receiptId: req.body.receiptId,
        yesterday:moment(Date.now()).format("DD")
    })

  
   res.json({response:true, msg:"Subcription Plan Successfully applied, payment submitted", data:user});
   
});

router.post('/getAddedPost',async function (req, res, next) {

    const user_id =  req.body.user_id;
    
    const data = await vehicle_db.find({user_id: user_id, approval: true});
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
        console.log(data)
        res.json({ response: true , msg: "Data Found", data: data });
    } 
   

}); 
////////////////////////////get product by id
router.post('/getVehicleById', async function(req, res, next){
   
  if( vehicle_db.find({viewer_id:[req.body.user_id]}) === true ){
     const data = await vehicle_db.findById(req.body.post_id).exec();
     res.json({ response: true , msg: "Data Found", data: data });
  } else{
     await vehicle_db.findByIdAndUpdate(req.body.post_id,{
        $push:{viewer_id: req.body.user_id},
        $inc:{view_count: 1}
     }) 
     const data = await vehicle_db.findById(req.body.post_id).exec();
     const user = req.body.user_id;
     var likeFlag = false;
     const user_data = await user_db.findById(user);
     console.log(user_data);
     for(var i=0;i < user_data.liked_post_id.length ;i++){
         if(user_data.liked_post_id[i] == req.body.post_id){
             likeFlag = true
         }
     }
    
    
     res.json({ response: true , msg: "Data Found", likeFlag: likeFlag, data: data});
  }

})

router.post('/getProductDetails',async function (req, res, next) {
             const user = req.body.user_id;
  
            const user_data = await user_db.findById(user);
   const data = await vehicle_db.findById( req.body.product_id);
   
        if(data == null) return res.json({response: false, msg: "Data not found"});
        else {
            
            console.log(user_data);
          
               for(var i=0;i < user_data.liked_post_id.length ;i++){
                   console.log(data);
                   if(user_data.liked_post_id[i] == data._id){
                       data.likeFlag = true
                   }
                }
            

            data.fcmToken = req.body.fcmToken;
           
            return res.json({response: true, msg:"Data found", data: data});
        }
   
});
router.post('/getAllProduct',async function (req, res, next) {
    const data = await vehicle_db.find().exec();
    const user = req.body.user_id;
    const user_data = await user_db.findById(user);
    console.log(user_data);
    if(user_data == null) res.json({ response: true , msg: "Data not Found" });
    else{
        for(var j=0; j < data.length; j++)
    {
       for(var i=0;i < user_data.liked_post_id.length ;i++){
           console.log(data[j]);
           if(user_data.liked_post_id[i] == data[j]._id){
               data[j].likeFlag = true
           }
       }
    }
    res.json({ response: true , msg: "Data Found", data: data }); 
    }
   
});

////////////////////////////////////////// Invoice

router.post('/getInvoice',async function (req, res, next) {

    user_bill_db.findOne({user_id:req.body.user_id})
    .then(result => {
        if (!result) return res.json({response: false, msg: "Billing Info not"});
        else {
            (async () => {

            const user = req.body.user_id;

            // Create a browser instance
            const browser = await puppeteer.launch();
          
            // Create a new page
            const page = await browser.newPage();
          
            // Website URL to export as pdf
            const website_url = 'https://belle-impex-360513.el.r.appspot.com/userWebview/'+user; 
          
            // Open URL in current page
            await page.goto(website_url, { waitUntil: 'networkidle0' }); 
          
            //To reflect CSS used for screens instead of print
            await page.emulateMediaType('screen');
          
          // Downlaod the PDF
            const pdf = await page.pdf({
              path: 'https://belle-impex-360513.el.r.appspot.com/image/',
              margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
              printBackground: true,
              format: 'A4',
            });
          
            // Close the browser instance
            await browser.close();
            res.json({ response: true , msg: "Data Found", pdf: 'https://belle-impex-360513.el.r.appspot.com/'});
        })();

        }
    })
 
});

router.post('/invoice',async function (req, res, next) {
    const user = req.body.user_id;
    user_bill_db.find({user_id:req.body.user_id})
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
            return res.json({response: true, msg:"User found", data: 'https://belle-impex-360513.el.r.appspot.com/userWebview/'+user});
        }
    })
});

router.post('/getForm',async function (req, res, next) {
    const subcategory = req.body.subcategoryId;
    subcategory_db.findById(subcategory)
    .then(result => {
        if (!result) return res.json({response: false, msg: "Subcategory not found"});
        else {
            return res.json({response: true, msg:"User found", data: 'https://belle-impex-360513.el.r.appspot.com/view_question/'+subcategory+'/'+req.body.userId});
        }
    })
});


module.exports = router;