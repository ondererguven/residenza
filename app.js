var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Routes definition
var canteen = require('./routes/canteen');
var dish = require('./routes/dish');
var equipment = require('./routes/equipment');
var index = require('./routes/index');
var laundry = require('./routes/laundry');
var menu = require('./routes/menu');
var services = require('./routes/services');
var shuttle = require('./routes/shuttle');
var users = require('./routes/users');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes setup
app.use('/canteen', canteen);
app.use('/dish', dish);
app.use('/equipment', equipment);
app.use('/', index);
app.use('/laundry', laundry);
app.use('/menu', menu);
app.use('/services', services);
app.use('/shuttle', shuttle);
app.use('/users', users);


/*-----------------------AUTH-----------------------*/

var oauth = require('./auth/oauth').oauth;
var permit = require('./auth/oauth').permit;

/*
var createClient = require('./auth/oauth').createClient;
app.get('/create-client', function(req, res){
  createClient().then(function(result){
    res.status(200).json(result);
  });
});
*/

// Handle token grant requests
app.all('/oauth/token', oauth.grant());

// Error handling
app.use(oauth.errorHandler());


/*-----------------------AUTH-----------------------*/


/*------------------------DB------------------------*/

var dbCredentials = require('./config/db');

if (dbCredentials.username == null || dbCredentials.password == null) {
  console.log("Error in db credentials");
}

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + dbCredentials.username + ':' + dbCredentials.password + '@localhost:27017/residence');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

/*------------------------DB------------------------*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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


app.listen(3000, function() {
  console.log('Residence app listening on port 3000!');
});
