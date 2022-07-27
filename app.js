var createError = require("http-errors");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
var logger = require('morgan');
var session = require('express-session');
var mongoose = require('mongoose');             //for mongodb


var mongoose = require('mongoose');
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
const indexRouter = require('./routes/index');





var app = express();



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
app.use('/user',indexRouter);
app.use('/category', indexRouter);
app.use('/add_category', indexRouter);
app.use('/add_subcategory', indexRouter);
app.use('/subcategory_list', indexRouter);
app.use('/vehicle_products', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
