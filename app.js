var createError = require("http-errors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
const cors = require("cors");
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');  
const Grid = require('gridfs-stream');
const {GridFsStorage} = require('multer-gridfs-storage');
var bodyParser = require('body-parser');    
const methodOverride = require('method-override');
const multer = require('multer');              //for mongodb

var mongoURI = 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority';



mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
var conn = mongoose.connection;
let gfs;
conn.on('connected', function() {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;


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
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });
module.exports = upload;

const indexRouter = require('./routes/index');
const user_apiRouter = require('./apis/user');
const category_apiRouter = require('./apis/category');
const userRouter = require('./routes/user');
const webview_apiRouter= require('./apis/webview');
const webview_user_router = require('./apis/user');
const dynamic_apiRouter= require('./apis/dynamic');
const productRouter = require('./apis/product');

global.imageBaseDir = '/public/images';



var app = express();

////////////////////////////////////////fb




// const fbAuth = require('./config/fbconfig')
// const {
//    login,
//    userBasedFunc
// } = require('./config/user')
// app.post('/login', login);
//app.get('/userBasedFunc', fbAuth, userBasedFunc);









/////////////
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

app.use('/', indexRouter);
app.use('/login', indexRouter);
app.use('/api/user',user_apiRouter);
app.use('/api/category',category_apiRouter);
app.use('/api/product',productRouter);
app.use('/webviewIndex',webview_apiRouter);
app.use('/userWebview', webview_user_router);
app.use('/dynamic',dynamic_apiRouter);
app.use('/user', userRouter);
app.use('/brand', indexRouter);
app.use('/year', indexRouter);
app.use('/budget', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
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

module.exports = app, gfs;
