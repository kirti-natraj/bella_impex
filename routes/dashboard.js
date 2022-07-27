var express = require('express');
var router = express.Router();
const moment = require('moment');
const task_db = require(('../models/task'));
const employee_db = require('../models/employee');
const project_db = require("../models/project");

router.get('/',async function(req, res, next) {
    const data= await task_db.find().exec();
    const emp_data= await employee_db.find().exec();
    const employee_count= await employee_db.index();
    let today = moment().format('MMMM Do YYYY, h:mm:ss a');
    let today_task= new Date();

    var dd = String(today_task.getDate()).padStart(2, '0');
    var mm = String(today_task.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today_task.getFullYear();

    today_task = mm + '/' + dd + '/' + yyyy;
    console.log(today);
    // const emp_data = await employee_db.find().exec();
    res.render('admin/dashboard', { title: 'ICS', data:data,emp_data , employee_count,today, today_task });
});
router.get('/admin_profile', function(req, res, next) {

    res.render('admin/admin_profile', { title: 'ICS'});
  });
router.get("/update_status/:id", async function(req, res, next){
    let _id = req.params.id;
    await task_db.findByIdAndUpdate(_id ,{status: true, feedback: req.query.feedback});
    res.redirect('/dashboard/');
});
module.exports = router;