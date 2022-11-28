var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var properties_db= require('../models/properties');
var subscription_db = require('../models/subscription');
var vehicle_db= require('../models/vehicle');
var product_db = require('../models/products');
const state_db = require('../models/state');
const city_db = require('../models/city');
var user_bill_db = require('../models/user_billing');
var invoice_db = require('../models/invoice');
const package_db = require('../models/subscription');
const moment = require('moment');
const multer = require('multer');
var otpGenerator = require('otp-generator');
var html_to_pdf = require('html-pdf-node');
const puppeteer = require('puppeteer');
const brand_db = require('../models/brand');
const year_db = require('../models/year');
const budget_db = require('../models/budget');
const invoiceGet_db = require('../models/getInvoice');
var user_bill_db = require('../models/user_billing');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

////////////////////////////////////////////////mongodb
// Mongo URI
const mongoURI = 'mongodb+srv://belle-impex:belle123@serverlessinstance0.wn38x.mongodb.net/?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs, gridfsBucket;
conn.once('open', () => {
 gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
 bucketName: 'uploads'
});

 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads');
})
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
            contentType: 'application/pdf',
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });


 router.post('/getProduct',async function (req, res, next) {

    const category = await subcategory_db.findById(req.body.categoryId);
    const data = await product_db.find({category:req.body.subcategory ,$or:[{brand: {$in:req.body.brandId}},{price:{$gte: 0,$lt: req.body.price}}]});
    if(data == ''){
        return res.json({response: false, msg:"No Product Found", data: [] })
    }else{ 
        return res.json({response: true, msg:"Product Found", data: data })
    }
}); 

router.post('/getProductById',async function (req, res, next) {

    const id =  req.body.productId;
    console.log(id)
    const data = await product_db.find({'_id': id, approval: true});       
    return res.json({response: true, msg:"Data found", data: data })


});

router.post('/editPrice',async function (req, res, next) {
    const data = await product_db.findById(req.body.productId);
    if(data == ''){
        return res.json({response: false, msg:"No Product Found", data: [] })
    }else{
        await product_db.findByIdAndUpdate(req.body.productId,{
            price: req.body.price
        });   
        const product_data = await product_db.findById(req.body.productId);  
        return res.json({response: true, msg:"Price Updated", data: product_data })
    }
}); 
////////// Brand Filter

router.post('/getCatBrand',async function (req, res, next) {
    const data = await brand_db.find({categoryId: req.body.subcategoryId});
    const budget = await budget_db.find({category: req.body.categoryId});
    if(data == ''){
        return res.json({response: false, msg:"No Brand Budget Found", brand: [] , budget:[]})
    }else{ 
        return res.json({response: true, msg:"Brand and Budget Found", brand: data,budget: budget })
    }
}); 

router.post('/getCatFilterProduct',async function (req, res, next) {
    const category = await category_db.findById(req.body.categoryId)
    const data = await product_db.find({category: category.category_name,$or:[{brand: req.body.brandId},{price:{$gte: req.body.min,$lt: req.body.max}}]});
    if(data == ''){
        return res.json({response: false, msg:"No Brand Found", data: [] })
    }else{ 
        return res.json({response: true, msg:"Brand Found", data: data })
    }
}); 

///////////////Price Filter

router.post('/getCatPriceProduct',async function (req, res, next) {
    const category = await category_db.findById(req.body.subcategoryId);
    const data = await product_db.find({category: category.category_name,price: {$gte:req.body.min,$lt:req.body.max}});
    if(data == ''){
        return res.json({response: false, msg:"No Product Found", data: [] })
    }else{ 
        return res.json({response: true, msg:"Product Found", data: data })
    }
}); 

//////////////////////////////////////getVehicle

router.post('/getVehicle',async function (req, res, next) {
    const vehicleId = await category_db.find({category_name:'Vehicles'});
    console.log(vehicleId[0]._id)
    const data = await product_db.find({category: vehicleId[0]._id, approval: true});
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
       
        if(req.body.brand == '' && req.body.year == '' && req.body.budget == '')  {
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
        }else if(req.body.brand != '' )
        {

              const data = await product_db.find({category: vehicleId[0]._id,brand: req.body.brand, approval: true});
              if(data == ''){
                res.json({ response: true , msg: "Data Not Found", data: data });
              }else{
                res.json({ response: true , msg: "Data Found", data: data });
              }
             

        } else if (req.body.year != '')
        {
            const year = new Date().getFullYear();
            
            const yearForm = await year_db.findById(req.body.year); 
            const yearObj = [];
            for(var i = 0; i < yearForm.yearCount; i++){
                yearObj[i] = year - i; 
            }
            console.log(yearObj);
            const vehicle = await product_db.find({category: vehicleId[0]._id, year:{$in: yearObj}, approval: true});
            if(vehicle == ''){
                res.json({ response: false , msg: "Data Not Found" , data: vehicle });
              }else{
                res.json({ response: true , msg: "Data Found", data: vehicle });
              }
           
        } else if(req.body.budget != '') 
        {
            const budgetData = await budget_db.findById(req.body.budget);   
            console.log(budgetData);
            const vehicle = await product_db.find({category: vehicleId[0]._id,price:{$gte: budgetData.from ,$lt: budgetData.to}, approval: true});
            if(vehicle == ''){
                res.json({ response: false, msg: "Data Not Found", data: vehicle });
              }else{
                res.json({ response: true , msg: "Data Found", data: vehicle });
              }
            
        } 
    
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

router.get('/getFilterData',async function(req, res, next) {                          //category add

    const brand =  await brand_db.find().exec();
     const year = await year_db.find().exec();
     const budget = await budget_db.find().exec();
     return res.json({respone: true, msg:'Data Found', brand: brand, year: year, budget:budget});
    // res.json('Successfully Product Addded'); //,{title:"popup", data : data} );
   });

router.post('/getPDF',async function (req, res, next) {
    const bill_data = await user_bill_db.findOne({user_id:req.body.userId});
    console.log(bill_data);
    const user = await user_db.findById(req.body.userId);
    const data = 'https://belle-impex-360513.el.r.appspot.com/userWebview/'+req.body.userId;
    const arrayData =[];
    for(var i = 0; i< user.packageIds.length;i++){
        const package = await package_db.findById(user.packageIds[i]);
        const invoice_data = await invoice_db.findOne({number:user.invoice[i]});
        arrayData[i] = {url:data+'/'+user.packageIds[i]+'/'+user.invoice[i], user_id: req.body.user_id, invoiceNo: invoice_data.number, price:'₹'+package.amount, date: invoice_data.created_on }
    
    }
    if(bill_data == null){
        return res.json({response: false, msg:"PDF not found", data: [] })
    }else{
        return res.json({response: true, msg:"PDF found", data: arrayData })
    }
    
   
});


////////////////////////////////// Get Subscription Plan

router.post('/checkSubscription',async function (req, res, next) {
    const user = await user_db.find({'_id':req.body.userId});
        const packageId = user[0].packageId;
        var data ={};
        console.log(packageId);
        if(packageId == ''){
            data= {};
        }else{
            const plan = await subscription_db.find({'_id': packageId});
            if(plan == ''){
                         data = { Subscription: "plan does not exist"};
            }else{
                data = {
                    product_id: plan[0]._id,
                        subscription_name: plan[0].subscription_name,
                        description: plan[0].description,
                        start_date: user[0].packageDate,
                        amount: plan[0].amount,
                        end_date: user[0].packageEnd
                }
            }
          
        }
       
        
         if(user[0].payment == true) 
         {
           return res.json({response: true, msg:"Subcription Taken", data: data  })
         }
         else
         {  
           res.json({response: false, msg:"Subscription not taken" , data: data})
         }
       
  

    }) ;     
   


router.post('/subscriptionPlan',async function (req, res, next) {
    var userData = await user_db.findById(req.body.userId);
    var endDate = userData.packageEnd;
    const number = otpGenerator.generate(6, { digits:true, upperCaseAlphabets:false, specialChars: false, lowerCaseAlphabets:false});
    const plan = await subscription_db.find({'_id': req.body.packageId});
    const a = moment(endDate, "DD-MM-YYYY");
    const b = moment(moment(Date.now()).format("DD-MM-YYYY"), "DD-MM-YYYY");
    var i = 0;
     i = a.diff(b, 'days');
    
    console.log(i);
    await user_db.findByIdAndUpdate(req.body.userId, {
        payment: true,
        receiptId: req.body.receiptId,
        $push: {packageIds: req.body.packageId, invoice: number},
        packageDate: moment(Date.now()).format("DD-MM-YYYY"),
        packageEnd: moment(Date.now()).add(plan[0].duration + i,"days").format("DD-MM-YYYY"),
        yesterday:moment(Date.now()).format("DD")
    })
    const invoice = await invoice_db.create({
        user_id: req.body.userId,
        number: number,
        created_on: moment(Date.now()).format("YYYY-MM-DD"),
        });
    var user = await user_db.findById(req.body.userId);
    
   res.json({response:true, msg:"Subcription Plan Successfully applied, payment submitted", data:user});
   
});

router.post('/getAddedPost',async function (req, res, next) {
    const user_id =  req.body.user_id;
    const data = await product_db.find({user_id: user_id});
    if(data == ''){
        return res.json({response: false, msg:"Data Not found", data: [] })
    }else{
        console.log(data);
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
   const data = await product_db.findById( req.body.product_id);
   
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
    const data = await product_db.find({approval:true}).exec();
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

    const user_data = await user_bill_db.findOne({user_id:req.body.user_id});
    if(user_data == ''){
 
    }else{
     let user = req.body.user_id;
     let options = { format: 'A4' };
     let file = { url: 'https://belle-impex-360513.el.r.appspot.com/userWebview/'+user };
     await html_to_pdf.generatePdf(file, options).then(async pdfBuffer => {
       console.log("PDF Buffer:-", pdfBuffer);
       return res.json({response: true, msg: "PDF", data: pdfBuffer});
     }); 
     }
  
 });
 

router.post('/invoice',async function (req, res, next) {
    const user = req.body.user_id;
    user_bill_db.find({user_id:req.body.user_id})
    .then(result => {
        if (!result) return res.json({response: false, msg: "User not found"});
        else {
            return res.json({response: true, msg:"User found", data: 'https://belle-impex-360513.el.r.appspot.com/userWebview/'+ user});
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