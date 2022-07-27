var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'BI' });
});

router.post('/save', async function(req, res, next) {
    console.log('Post data', req.body);
    try{
      const user = await admin_db.find({username:req.body.email,password:req.body.password}).exec();
      // console.log(user);
      if(user.username !== req.body.email || user.password !== req.body.password){
       res.render('index',{ title: "Hey"});
   
      }else{
        sessionVar=req.session;
        sessionVar.userdetail=user;
        sessionVar.save();
        // console.log('After Save : ',sessionVar);
        //res.send('Logged In');
        res.redirect('/');
      }
    }catch(err){
      // console.log('Invalid Creadentials catch');
      res.render('index', { title: '2nd'});
    
    }
    res.render('index', { title: 'BI' });
  });
 
module.exports = router;