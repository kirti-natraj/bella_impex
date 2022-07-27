var express = require('express');
var router = express.Router();
var admin_db = require('../models/adminlogin');
var user_db = require('../models/user');
var post_db = require('../models/post');
const moment = require('moment');

router.get('/', function(req, res, next) {                        //for category page
    res.render('category', { title: 'Category List' });
  });