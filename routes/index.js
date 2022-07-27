var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
const moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {                        //for login Page
  res.render('login', { title: '' });
});
router.get('/vehicle_products', function(req, res, next) {                        //for login Page
  res.render('vehicle_products_form', { title: '' });
});
router.get('/index',function(req,res,next){                          //for Dashboard Page
  res.render('index',{title: 'Dashboard'});
});

router.get('/user',async function(req,res,next){                        //for UserTable Page
  const data = await user_db.find().exec();
  
  res.render('user',{title:'User Table',data : data});


});
///////////////////////////////////////////////category
router.get('/category',async function(req,res,next){                        //for UserTable Page
  const data = await category_db.find().exec();
 
  res.render('category',{title:'Category List',data : data});


});

router.get('/add_category',async function(req,res,next){                        //for Category TAble Update
 
  res.render('add_category',{title:'Add Category'});

});


router.post('/add_category_form', async function(req, res, next) {                          //category add

  await category_db.create({
      category_name: req.body.category_name,
      category_desc: req.body.category_desc,
      created_on: Date.now(),
  });
  res.redirect('/category/');
});

//////////////////////////////////////subcat

router.get('/add_subcategory/:id',async function(req,res,next){                        //for Category TAble Update
  let _id = req.params.id;
  const category_name = await category_db.findById(_id);
  res.render('add_subcategory',{title:'Add Subcategory', id: _id, category_name: category_name});

});

router.get('/subcategory_list',async function(req,res,next){                        //for SubCategory TAble Update
  const data = await category_db.find().exec();
  const sub_data = await subcategory_db.find().exec();
  res.render('subcategory_list',{title:'Subcategory List', data: data, sub_data: sub_data, moment:moment});

});


router.post('/subcategory_form/:id', async function(req,res,next ){                          //for updating subcategory info
  let _id = req.params.id;
  await subcategory_db.create({
      sub_category_name: req.body.sub_category_name,
      created_on: Date.now(),
      category_id: _id,
  });
 
  res.redirect('/category/');
});


router.get('/update_subcat/:id', async function(req,res,next ){
  let id= req.params.id
  const sub_data = await subcategory_db.find({'_id':id});
  const data = await category_db.find().exec();
  res.render('sub_update', {data:data , id:id,sub_data:sub_data, title: 'Update Subcategory' });
});

router.post('/update_subcat_form/:id', async function(req,res,next ){
  let _id = req.params.id;

  const a1= await subcategory_db.findByIdAndUpdate( _id, {
      sub_category_name: req.query.sub_category_name,
      category_id: req.query.category_id,
    
    });
  res.redirect('/subcategory_list/');
});

///////////////////////////////admin Login
router.post('/save', async function(req, res, next) {
 
  try{
    const user = await admin_db.findOne({username:req.body.email,password:req.body.password});
   console.log(user);
    if(user.username === req.body.email && user.password === req.body.password  ){
      res.render('index',{title:'Welcome to Admin Panel'});
    }
 else if(user.username === req.body.email || user.password === req.body.password  ){
  res.render('login',{ title: '* Wrong Credentials', msg:'Incorrect Password!!'});
    }else{
      // sessionVar=req.session;
      // sessionVar.userdetail=user;
      // sessionVar.save();
      // console.log('After Save : ',sessionVar);
      res.render('login',{ title: 'Empty Fields', msg:'Incorrect Password!!'});
     
    }
  }catch(err){
   console.log(err);
   res.render('login',{ title: '* Wrong Credentials', msg:'Incorrect Password!!'});
  
  }
});



module.exports = router;