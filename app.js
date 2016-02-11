var express = require('express');
var path = require('path');
var http = require('http');
var config = require('config');
var log = require('./libs/log')(module);
var HttpError = require('./error').HttpError;
var favicon = require('serve-favicon');
var errorhandler = require('errorhandler');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var logger = require('morgan');

var app = express();
//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization, Content-Length");
//  if ('OPTIONS' === req.method) {
//    res.sendStatus(200);
//  }
//  else {
//    next();
//  }
//});
//res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');


app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

if (app.get('env') == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: config.get('session:secret'),
  key: config.get('session:key'),
  cookie: config.get('session:cookie'),
  resave: true,
  saveUninitialized: true
}));

require('./middleware/passportAuth');

app.use(passport.initialize());
app.use(passport.session());
app.use(require('./middleware/loadUser'));
app.use(require('./middleware/sendHttpError'));
require('./routes')(app);

app.use(function(err, req, res, next) {
  if (typeof err == 'number') {
    err = new HttpError(err);
  }
  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorhandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

app.listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});