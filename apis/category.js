var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var category_db = require('../models/category');
var subcategory_db = require('../models/sub_category');
var banner_db= require('../models/banner');
var properties_db= require('../models/properties');
var vehicle_db= require('../models/vehicle');
var page_db = require('../models/page');
var group_db = require('../models/group');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const { ResultStorage } = require('firebase-functions/v1/testLab');
const feedStory = require('../models/feedStory');

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

// Create storage engine
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
          contentType: 'image/jpeg',
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


router.get('/',async function (req, res, next) {
    const data = await category_db.find().exec();
    if(data == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: data })
    }    
    else
    {
        const first = await category_db.findOne({category_name: 'Vehicles'});
        const second = await category_db.findOne({category_name: 'Properties'});
        const third = await category_db.findOne({category_name:'Mobile'});
        const last =[];
        last[0]= { _id: first._id,
        category_name: first.category_name,
        image: first.image,
        created_on: first.created_on,
        created_by: 'Admin',
        status: true,
        __v: 0};
       
        last[1] = { _id: second._id,
          category_name: second.category_name,
          image: second.image,
          created_on:second.created_on,
          created_by: 'Admin',
          status: true,
          __v: 0};
        
          last[2]= { _id: third._id,
            category_name: third.category_name,
            image: third.image,
            created_on: third.created_on,
            created_by: 'Admin',
            status: true,
            __v: 0};
  
        for(var i=0;i<data.length;i++){
          if(data[i].category_name != 'Vehicles' && data[i].category_name != 'Properties' && data[i].category_name != 'Mobile'){
            last.push(data[i]);
          }
        }
        res.json({ response: true , msg: "Data Found", data: last });
    } 

 
});

router.post('/subcategory',async function (req, res, next) {
    const cat_id =  req.body.category_id;
    console.log(cat_id)
    const data = await subcategory_db.find({category_id: cat_id});
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
 router.get('/getBanner', async function(req, res, next){
     const data = await banner_db.find().select('image');
//      const user = await user_db.findOne({payment: true});
//      var d = new Date(); // Today!
// //d.setDate(d.getDate() - 1); // Yesterday!
// console.log((d.getDate() - 1));
     
//      if(user.yesterday == (d.getDate() - 1))
//      {
//         await user_db.findOneAndUpdate({payment: true},{
//             $inc:{
//                 sub_left_day : -1,
              
//               }  ,
//               yesterday: moment(Date.now()).format("DD")
                      
//          })
//      }
   
     const totalUserCount = await user_db.count(); 
     if(data == '') 
     {
        
         return res.json({response: false, msg:"Data not found", totalUserCount :totalUserCount , data: data })
     }    
     else
     {
         console.log(data)
         res.json({ response: true , msg: "Data Found", totalUserCount :totalUserCount, data: data});
     } 
 });

 ////////////////////////////////page//////
 const fUpload = upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'profileImage', maxCount: 1 }])
 
 router.post('/createPage',fUpload ,async function (req, res, next) {
     let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
     let category = await category_db.findById(req.body.categoryId);
     if(req.body.pageName == "" || req.body.categoryId == ""){
        res.json({ response: false , msg: "Please Insert page name or category ID" });
     }else if(req?.files['coverImage'] == undefined && req?.files['profileImage'] == undefined){
        const page = await page_db.create(
            {
    
                userId: req.body.userId,
                coverImage: "",
                profileImage: "",
                pageName: req.body.pageName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutPage: req.body.aboutPage,
                pageEmail: req.body.pageEmail,
                pageWebsite: req.body.pageWebsite,
                created_on: moment(Date.now()).format("MMM Do YYYY")
    
            }
        );
            res.json({ response: true , msg: "Page Created" });
     }else if(req?.files['coverImage'] == undefined){
        const page = await page_db.create(
            {
    
                userId: req.body.userId,
                coverImage: "",
                profileImage: baseUrl+req?.files['profileImage'][0]?.filename,
                pageName: req.body.pageName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutPage: req.body.aboutPage,
                pageEmail: req.body.pageEmail,
                pageWebsite: req.body.pageWebsite,
                created_on: moment(Date.now()).format("MMM Do YYYY")
    
            }
        );
            res.json({ response: true , msg: "Page Created" });
     }else if(req?.files['profileImage'] == undefined){
        const page = await page_db.create(
            {
    
                userId: req.body.userId,
                coverImage: baseUrl+req?.files['coverImage'][0]?.filename,
                profileImage: "",
                pageName: req.body.pageName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutPage: req.body.aboutPage,
                pageEmail: req.body.pageEmail,
                pageWebsite: req.body.pageWebsite,
                created_on: moment(Date.now()).format("MMM Do YYYY")
    
            }
        );
            res.json({ response: true , msg: "Page Created" });
     }else{
        const page = await page_db.create(
            {
    
                userId: req.body.userId,
                coverImage: baseUrl+req?.files['coverImage'][0]?.filename,
                profileImage: baseUrl+req?.files['profileImage'][0]?.filename,
                pageName: req.body.pageName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutPage: req.body.aboutPage,
                pageEmail: req.body.pageEmail,
                pageWebsite: req.body.pageWebsite,
                created_on: moment(Date.now()).format("MMM Do YYYY")
    
            }
        );
            res.json({ response: true , msg: "Page Created" });
     }
     
 
});

router.post('/getCreatedPage', async function(req, res, next){
    const page = await page_db.find({userId: req.body.userId}); 
    if(page == '') 
    {
       
        return res.json({response: false, msg:"Data not found", data: [] })
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/getCreatedPageDetails', async function(req, res, next){
    const page = await page_db.find({ _id: req.body.pageId, userId: req.body.userId}); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/inviteInPage', async function(req, res, next){
    let userId = req.body.userId;
    console.log(userId.length);
    for(var i=0;i<userId.length;i++){
        const user = await user_db.findById(userId[i]);
        page = await page_db.findByIdAndUpdate(req.body.pageId,{
           $push: {invite: {
               userId: userId,
               userImage: user.image,
               userName:user.name
           }}
        }); 
    }
   
    
    
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" })
    }else
    {
      
        res.json({ response: true , msg: "Invite Added"});
    } 
});

router.post('/suggestionPage', async function(req, res, next){
    const page = await page_db.find().exec(); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/suggestionPageJoinDeny', async function(req, res, next){
    const page = await page_db.find().exec(); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/updateProfileImage',upload.single('profileImage'), async function(req, res, next){
    const cat =  await page_db.findById(req.body.pageId);
    const original = cat.profileImage;
    const filenames = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filenames);
    const file = await gfs.files.findOne({filename: filenames});
    await gridfsBucket.delete(file._id);
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    const page = await page_db.findOneAndUpdate({_id:req.body.pageId, userId: req.body.userId},{
       profileImage: baseUrl+req.file.filename,
    }); 
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" , data:  baseUrl+req.file.filename})
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Updated", data:  baseUrl+req.file.filename});
    } 
});

router.post('/updateCoverImage',upload.single('coverImage'), async function(req, res, next){
    const cat =  await page_db.findById(req.body.pageId);
    const original = cat.coverImage;
    const filenames = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filenames);
    const file = await gfs.files.findOne({filename: filenames});
    await gridfsBucket.delete(file._id);
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    const page = await page_db.findOneAndUpdate({_id:req.body.pageId, userId: req.body.userId},{
       coverImage: baseUrl+ req.file.filename,
    }); 
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" ,data:  baseUrl+req.file.filename})
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Updated", data:  baseUrl+req.file.filename});
    } 
});

router.post('/updatePagedetail',async function (req, res, next) {
    let category = await category_db.findById(req.body.categoryId);
     await page_db.findOneAndUpdate({_id:req.body.pageId, userId: req.body.userId},
        {
            userId: req.body.userId,
            pageName: req.body.pageName,
            categoryId: req.body.categoryId,
            categoryName: category.category_name,
            aboutPage: req.body.aboutPage,
            pageEmail: req.body.pageEmail,
            pageWebsite: req.body.pageWebsite
        }
    );
    const page = await page_db.find({_id:req.body.pageId, userId: req.body.userId});
    res.json({ response: true , msg: "Updated", data: page});
});

/////////////////////////////GROUP////////////////////////////////

router.post('/createGroup',fUpload,async function (req, res, next) {
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    let category = await category_db.findById(req.body.categoryId);
    console.log(req?.files['coverImage'][0]?.filename);
    if(req.body.groupName == "" || req.body.categoryId == "" || req.body.privacyStandard == ""){
        res.json({ response: false , msg: "Please Insert page name or category ID" });
     }else if(req?.files['coverImage'] == undefined && req?.files['profileImage'] == undefined){
        const page = await group_db.create(
            {
                userId: req.body.userId,
                coverImage: "",
                profileImage: "",
                groupName: req.body.groupName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutGroup: req.body.aboutGroup,
                privacyStandard: req.body.privacyStandard,
                location: req.body.location,
                created_on: moment(Date.now()).format("MMM Do YYYY")
            }
        );
            res.json({ response: true , msg: "Group Created" });
     }else if(req?.files['coverImage'] == undefined){
        const page = await group_db.create(
            {
                userId: req.body.userId,
                coverImage: "",
                profileImage: baseUrl+req?.files['profileImage'][0]?.filename,
                groupName: req.body.groupName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutGroup: req.body.aboutGroup,
                privacyStandard: req.body.privacyStandard,
                location: req.body.location,
                created_on: moment(Date.now()).format("MMM Do YYYY")
            }
        );
            res.json({ response: true , msg: "Group Created" });
     }else if(req?.files['profileImage'] == undefined){
        const page = await group_db.create(
            {
                userId: req.body.userId,
                coverImage: baseUrl+req?.files['coverImage'][0]?.filename,
                profileImage: "",
                groupName: req.body.groupName,
                categoryId: req.body.categoryId,
                categoryName: category.category_name,
                aboutGroup: req.body.aboutGroup,
                privacyStandard: req.body.privacyStandard,
                location: req.body.location,
                created_on: moment(Date.now()).format("MMM Do YYYY")
            }
        );
            res.json({ response: true , msg: "Group Created" });
     }else{
    const page = await group_db.create(
        {
            userId: req.body.userId,
            coverImage: baseUrl+req?.files['coverImage'][0]?.filename,
            profileImage: baseUrl+req?.files['profileImage'][0]?.filename,
            groupName: req.body.groupName,
            categoryId: req.body.categoryId,
            categoryName: category.category_name,
            aboutGroup: req.body.aboutGroup,
            privacyStandard: req.body.privacyStandard,
            location: req.body.location,
            created_on: moment(Date.now()).format("MMM Do YYYY")
        }
    );
        res.json({ response: true , msg: "Group Created" });
    }
 
});

router.post('/getCreatedGroup', async function(req, res, next){
    const page = await group_db.find({userId: req.body.userId}); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }else{
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/getCreatedGroupDetails', async function(req, res, next){
    const page = await group_db.find({ _id: req.body.groupId, userId: req.body.userId}); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/inviteInGroup', async function(req, res, next){
    let userId = req.body.userId;
    console.log(userId.length);
    for(var i=0;i<userId.length;i++){
    const user = await user_db.findById(userId);
    
         page = await group_db.findByIdAndUpdate(req.body.pageId,{
            $push: {invite: {
                userId: userId,
                userImage: user.image,
                userName: user.name
            }}
         }); 
        }
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" })
    }else
    {
        console.log(page)
        res.json({ response: true , msg: "Invite Added"});
    } 
});

router.post('/suggestionGroup', async function(req, res, next){
    const page = await group_db.find().exec(); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/suggestionGroupJoinDeny', async function(req, res, next){
    const page = await group_db.find().exec(); 
    if(page == '') 
    {
        return res.json({response: false, msg:"Data not found", data: [] })
    }else
    {
        console.log(page)
        res.json({ response: true , msg: "Data Found",data: page});
    } 
});

router.post('/updateGroupDetail',async function (req, res, next) {
    let category = await category_db.findById(req.body.categoryId);
     await group_db.findOneAndUpdate({_id:req.body.groupId, userId: req.body.userId},
        {
            userId: req.body.userId,
            groupName: req.body.pageName,
            categoryId: req.body.categoryId,
            categoryName: category.category_name,
            aboutGroup: req.body.aboutPage,
            location: req.body.location,
            privacyStandard: req.body.privacyStandard
        }
    );
    const page = await group_db.find({_id:req.body.groupId, userId: req.body.userId});
    res.json({ response: true , msg: "Updated", data: page});
});

router.post('/updateGroupProfileImage',upload.single('profileImage'), async function(req, res, next){
    const cat =  await group_db.findById(req.body.groupId);
    const original = cat.profileImage;
    const filenames = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filenames);
    const file = await gfs.files.findOne({filename: filenames});
    await gridfsBucket.delete(file._id);
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    const page = await group_db.findOneAndUpdate({_id:req.body.groupId, userId: req.body.userId},{
       profileImage: baseUrl+req.file.filename,
    }); 
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" , data:  baseUrl+req.file.filename})
    }    
    else
    {
        console.log(page)
        res.json({ response: true , msg: "Updated", data:  baseUrl+req.file.filename});
    } 
});

router.post('/updateGroupCoverImage',upload.single('coverImage'), async function(req, res, next){
    const cat =  await group_db.findById(req.body.groupId);
    const original = cat.coverImage;
    const filenames = original.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
    console.log(filenames);
    const file = await gfs.files.findOne({filename: filenames});
    await gridfsBucket.delete(file._id);
    let baseUrl = 'https://belle-impex-360513.el.r.appspot.com/image/';
    const page = await group_db.findOneAndUpdate({_id:req.body.groupId, userId: req.body.userId},{
       coverImage: baseUrl+ req.file.filename,
    }); 
    if(page == '') 
    {
        return res.json({response: false, msg:"not found" ,data:  baseUrl+req.file.filename})
    }else{
        console.log(page)
        res.json({ response: true , msg: "Updated", data:  baseUrl+req.file.filename});
    } 
});

router.post('/deletePageGroup', async function(req, res, next){

    if(req.body.type == "group"){
        const group =  await group_db.findById(req.body.id);
        const cover = group.coverImage;
        const profile = group.profileImage;
        const filename = [];
        filename[0] = cover.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
        filename[1] = profile.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
        console.log(filename);
        try {
            await gridfsBucket.delete({ filename: {$in:filename} });
            console.log("success");
        } catch (error) {
            console.log(error);
        }
       await group_db.deleteOne({_id: req.body.id});
       res.json({ response: true , msg: "Group Deleted Successfully"});
    }else{
        const group =  await page_db.findById(req.body.id);
        const cover = group.coverImage;
        const profile = group.profileImage;
        const filename = [];
        filename[0] = cover.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
        filename[1] = profile.replace('https://belle-impex-360513.el.r.appspot.com/image/','');
        console.log(filename);
        try {
            const file = await gfs.files.findOne({filename: filename[0]});
            await gridfsBucket.delete(file._id);
            const fileTwo = await gfs.files.findOne({filename: filename[1]});
            await gridfsBucket.delete(fileTwo._id);
            console.log("success");
        } catch (error) {
            console.log(error);
        }
        try {
            const fileTwo = await gfs.files.findOne({filename: filename[1]});
            await gridfsBucket.delete(fileTwo._id);
            console.log("success");
        } catch (error) {
            console.log(error);
        }
        await page_db.deleteOne({_id: req.body.id});
        res.json({ response: true , msg: "Page Deleted Successfully"});
    }
});

router.post('/search', async function(req, res, next){
    const key = req.body.key;
    if(req.body.type == 'Group'){
              const data = await group_db.find({$or:[{groupName: {$regex: key , $options: 'm'}},{categoryName: {$regex: key , $options: 'm'}},{aboutGroup: {$regex: key , $options: 'm'}},{location: {$regex: key , $options: 'm'}}]} );
              console.log(data);
              if(data == ''){
                res.json({ response: false , msg: "No Data Found",data: []});
              }else{
                const user_data =[];
                for(var i =0;i<data.length;i++){
                   user_data[i] = {
                    type: 'Group',
                    id: data[i]._id,
                    name: data[i].groupName,
                    profileImage: data[i].profileImage
                   }
                }
                res.json({ response: true , msg: "Data Found",data: user_data});
              }
             
    }else if(req.body.type == 'Page'){
              const data = await page_db.find({$or:[{pageName: {$regex: key , $options: 'm'}},{categoryName: {$regex: key , $options: 'm'}},{aboutPage: {$regex: key , $options: 'm'}}]} );
              console.log(data);
              if(data == ''){
                res.json({ response: false , msg: "No Data Found",data: []});
              }else{
                const user_data =[];
                for(var i =0;i<data.length;i++){
                   user_data[i] = {
                    type: 'Page',
                    id: data[i]._id,
                    name: data[i].pageName,
                    profileImage: data[i].profileImage
                   }
                }
                res.json({ response: true , msg: "Data Found",data: user_data});
              }
    }else if(req.body.type == 'User'){
             const data = await user_db.find({$or:[{user_name: {$regex: key , $options: 'm'}},{name: {$regex: key , $options: 'm'}},{about_business: {$regex: key , $options: 'm'}},{address: {$regex: key , $options: 'm'}}]} );
             console.log(data);
             if(data == ''){
                res.json({ response: false , msg: "No Data Found",data: []});
              }else{
                const user_data =[];
                for(var i =0;i<data.length;i++){
                   user_data[i] = {
                    type: 'User',
                    id: data[i]._id,
                    name: data[i].name,
                    profileImage: data[i].image
                   }
                }
                res.json({ response: true , msg: "Data Found",data: user_data});
              }
    }else if(req.body.type == 'All'){
        const group = await group_db.find({$or:[{groupName: {$regex: key , $options: 'm'}},{categoryName: {$regex: key , $options: 'm'}},{aboutGroup: {$regex: key , $options: 'm'}},{location: {$regex: key , $options: 'm'}}]} );
     
        const page = await page_db.find({$or:[{pageName: {$regex: key , $options: 'm'}},{categoryName: {$regex: key , $options: 'm'}},{aboutPage: {$regex: key , $options: 'm'}}]} );
       
        const user = await user_db.find({$or:[{user_name: {$regex: key , $options: 'm'}},{name: {$regex: key , $options: 'm'}},{about_business: {$regex: key , $options: 'm'}},{address: {$regex: key , $options: 'm'}}]} );
        const all_data = [];
        if(group != ''){
            for(var i =0;i<group.length;i++){
                all_data.push({
                type: 'Group',
                id: group[i]._id,
                name: group[i].groupName,
                profileImage: group[i].profileImage
               })
            }
          }
          if(page != ''){
             for(var i =0;i<page.length;i++){
                all_data.push({
                 type: 'Page',
                 id: page[i]._id,
                 name: page[i].pageName,
                 profileImage: page[i].profileImage
                })
             }
           }
           if(user != ''){
             for(var i =0;i<user.length;i++){
                all_data.push({
                 type: 'User',
                 id: user[i]._id,
                 name: user[i].name,
                 profileImage: user[i].image
                })
             }
           }
        res.json({ response: true , msg: "Data Found",data: all_data });    

    }  
});

module.exports = router;