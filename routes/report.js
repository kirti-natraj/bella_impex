const express = require('express');
const router = express.Router();
const project_db = require("../models/project");
const task_db = require('../models/task');
const employee_db = require("../models/employee");
/* GET home page. */
router.get('/project_report',async function(req, res, next) {
    const data = await project_db.find().exec();
    res.render('admin/project_report', { title: 'ICS' ,data: data});
});
router.get('/emp_report',async function(req, res, next) {
    const data = await task_db.find().exec();
    res.render('admin/emp_work', { title: 'ICS' ,data: data});
});
router.get('/emp_task',async function(req, res, next) {
    const data = await task_db.find().exec();
    res.render('admin/task_list', { title: 'ICS' ,data: data});
});
router.get('/emp_attend',async function(req, res, next) {
    const data = await task_db.find().exec();
    res.render('admin/emp_attend', { title: 'ICS' ,data: data});
});
router.get('/indie_attend/:id', async function(req,res,next ){
    let id= req.params.id
    const data = await task_db.find({employee_id:id});

    res.render('admin/indie_attend', {data:data });
});
module.exports = router;