var express = require('express');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 
var fs = require('fs-extra');
var url = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';
var multer = require('multer');
var upload = multer({limits: {fileSize: 1064960 },dest:'/uploads/'}).single('picture');

var app = express();
   
// Default route http://localhost:3000/
app.get('/', function(req, res){
    res.send('yo');
});
 
// Form POST action handler
app.post('/uploadpicture', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.status(500).json({ error: 'message' });
        }
        
        if (req.file == null) {
            // If Submit was accidentally clicked with no file selected...
            res.send('boo');
        } else {
            // read the img file from tmp in-memory location
            var newImg = fs.readFileSync(req.file.path);
            // encode the file as a base64 string.
            var encImg = newImg.toString('base64');
            // define your new document
            var newItem = {
                description: req.body.description,
                contentType: req.file.mimetype,
                size: req.file.size,
                img: Buffer(encImg, 'base64')
            };
        
            db.collection('images').insert(newItem)
                .then(function() {
                    console.log('image inserted!');
                });
            
            res.send('yo');
        }
    });
});

module.exports = app;