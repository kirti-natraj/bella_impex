const express = require('express');
const router = express.Router();
const employee_db = require('../models/employee');
const task_db = require("../models/task");
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
const upload = multer({ storage: storage });
router.get('/',async function(req, res, next) {
const data = await employee_db.find().exec();
    res.render('admin/employees', { title: 'ICS', data: data , moment: moment});
});
router.get('/create_employee',async function(req, res, next) {
    console.log('arrived');
    console.log('arrived');
    res.render('admin/create_employee', { title: 'ICS' });
});
router.post('/add_employee',upload.fields([{ name: 'employee_profile', maxCount: 1 }]), async function(req, res, next) {
    await employee_db.create({
        employee_name: req.body.employee_name,
        employee_id: req.body.employee_id,
        technology: req.body.technology,
        mobile: req.body.mobile,
        email: req.body.email,
        birthdate: req.body.birthdate,
        employee_profile: req.files.employee_profile[0].filename,
        employee_type: req.body.employee_type,
    });
    res.redirect('/employee/');
});
router.get('/edit/:id', async function(req,res,next ){
    let id= req.params.id
    const data = await employee_db.find({'_id':id});

    res.render('admin/update_employee', {data:data , id:id, title: 'ICS' });
});
router.get('/edit_form/:id', async function(req,res,next ){
    let _id = req.params.id;

    const a1= await employee_db.findByIdAndUpdate(_id, {
        employee_name:req.query.employee_name,
        employee_id:req.query.employee_id,
        technology:req.query.technology,
        mobile: req.query.mobile,
        email: req.query.email,
        birthdate: req.query.birthdate,
        employee_type:req.query.employee_type});
    res.redirect('/employee/');
});
router.get('/delete/:id', async function(req,res,next ){
    let id= req.params.id;
    await employee_db.deleteOne({ _id:id});

    res.redirect('/employee/');

});
module.exports = router;