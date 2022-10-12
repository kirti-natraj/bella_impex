var createError = require("http-errors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
const cors = require("cors");
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose'); 
var MongoClient = require('mongodb').MongoClient; 
const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');
var bodyParser = require('body-parser');    
const methodOverride = require('method-override');
const multer = require('multer');              //for mongodb

mongoose.connect('mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;


// Create storage engine


const indexapp = require('./routes/index');
const user_apiapp = require('./apis/user');
const category_apiapp = require('./apis/category');
const userapp = require('./routes/user');
const webview_apiapp= require('./apis/webview');
const webview_user_app = require('./apis/user');
const productapp = require('./apis/product');

global.imageBaseDir = '/public/images';



var app = express();

////////////////////////////////////////fb
const mongoURI = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';

// Create mongo connection


// Init gfs
let gfs, gridfsBucket;
conn.once('open', () => {
 gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
 bucketName: 'uploads'
});

 gfs = Grid(conn.db, mongoose.mongo);
 gfs.collection('uploads');
})

  ///////
 


// @route GET /image/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Check if image
    if(file.contentType === 'image/jpeg' || file.contentType 
    ==='image/png') 
    {
       const readStream = gridfsBucket.openDownloadStream(file._id);
       readStream.pipe(res);
    }
  });
});

app.use(cors());

app.use(methodOverride('_method'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const oneDay = 1000 * 60 * 60 * 6;
app.use(session({
  secret: 'pick23468546235687',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: oneDay },
   key: 'sid'
}))

app.use('/login', indexapp);
app.use('/api/user',user_apiapp);
app.use('/api/category',category_apiapp);
app.use('/api/product',productapp);
app.use('/webviewIndex',webview_apiapp);
app.use('/userWebview', webview_user_app);
app.use('/user', userapp);
app.use('/', indexapp);

// catch 404 and forward to error handler

// foor json
app.use(bodyParser.urlencoded({extended: false}));                       //added for image view
app.use(bodyParser.json());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 // res.render('error');
});
app.use(function(req, res, next) {
  return res.json({response: false, msg:"Page Not found"})
  //next(createError(404));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
module.exports = app;
