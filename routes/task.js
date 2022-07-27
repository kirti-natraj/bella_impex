var express = require('express');
var router = express.Router();
const project_db = require("../models/project");
const task_db = require("../models/task");
const employee_db = require("../models/employee");
/* GET home page. */
router.get('/', async function(req, res, next) {
   const data = await employee_db.find().exec();

    res.render('admin/task', { title: 'ICS' ,data:data});
});
router.get('/assign_task/:id', async function(req,res,next ){
    let id= req.params.id
    const data = await employee_db.find({'_id':id});
    const pro_data = await project_db.find().exec();
    res.render('admin/create_task', {data:data , id:id,pro_data, title: 'ICS' });
});
router.post('/assign_sub/:id', async function(req,res,next ){
    let id= req.params.id
    const data = await employee_db.find({'_id':id});
    await task_db.create(
        {
            employee_name: req.body.employee_name,
            employee_id: id,
            technology: req.body.technology,
            project_name: req.body.project_name,
            task_note :req.body.task_note,
            task_date :req.body.task_date,

        }
    )
    res.redirect('/report/emp_task');
});
router.get('/edit/:id', async function(req,res,next ){
    let id= req.params.id
    const data = await task_db.find({'_id':id});
    const pro_data = await project_db.find().exec();
    res.render('admin/update_task', {data:data , id:id, pro_data, title: 'ICS' });
});
router.get('/edit_form/:id', async function(req,res,next ){
    let _id = req.params.id;

    const a1= await task_db.findByIdAndUpdate(_id, {
        project_name: req.query.project_name,
        task_date: req.query.task_date,
        task_note :req.query.task_note,
      });
    res.redirect('/report/emp_task');
});
router.get('/delete/:id', async function(req,res,next ){
    let id= req.params.id;
    await task_db.deleteOne({_id:id});
    res.redirect('/report/emp_task');

});
module.exports = router;