const express = require('express');
const router = express.Router();
const project_db = require("../models/project");
const task_db = require('../models/task');
const employee_db = require("../models/employee");
/* GET home page. */

router.get('/user',async function(req,res,next){                        //for UserTable Page
    const data = await user_db.find().exec();
    
    res.render('user',{title:'User Table',data : data});
  
  
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
  
  //////////////////////////////////////subcat
  router.get('/subcategory_list', async function(req,res,next){                        //for SubCategory TAble Update
    // const data = await category_db.find().exec();
    // const sub_data = await subcategory_db.find().exec();
    res.render('subcategory_list',{title:'Subcategory', data: data, sub_data: sub_data, moment: moment});
  
  });

  router.get('/add_subcategory/:id',async function(req,res,next){                        //for Category TAble Update
    let _id = req.params.id;
    const category_name = await category_db.findById(_id);
    res.render('add_subcategory',{title:'Add Subcategory', id: _id, category_name: category_name});
  
  });

  
  router.post('/subcategory_form/:id', async function(req,res,next ){                          //for updating subcategory info
    let _id = req.params.id;
    await subcategory_db.create({
        sub_category_name: req.body.sub_category_name,
        created_on: Date.now(),
        category_id: _id,
    });
   
    res.redirect('/subcategory_list/');
  });
  
  
  router.get('/update_subcat/:id', async function(req,res,next ){
    let id= req.params.id
    const sub_data = await subcategory_db.find({'_id':id});
    const data = await category_db.find().exec();
    res.render('sub_update', {data:data , id:id,sub_data:sub_data, title: 'Update Subcategory' });
  });
  
  router.get('/update_subcat_form/:id', async function(req,res,next ){
    let _id = req.params.id;
  
    const a1= await subcategory_db.findByIdAndUpdate( _id, {
        sub_category_name: req.query.sub_category_name,
        category_id: req.query.category_id,
      
      });
    res.redirect('/subcategory_list/');
  });

/////////////////////////////////////////delete
router.get('/delete_subcat/:id', async function(req,res,next ){
    let id= req.params.id;
    await subcategory_db.deleteOne({ _id:id});
  
    res.redirect('/subcategory_list/');
  
  });
  
  router.get('/delete_cat/:id', async function(req,res,next ){
    let id= req.params.id;
    await category_db.deleteOne({ _id:id});
  
    res.redirect('/category/');
  
  });
module.exports = router;