var express = require('express');
var path = require('path');
var http = require('http');
var config = require('./config');
var log = require('./libs/log')(module);
var HttpError = require('./error').HttpError;
var favicon = require('serve-favicon');
var errorhandler = require('errorhandler');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var everyauth = require('everyauth');
var store = require('./models/model').store;
var registrationRedirectPatn = "http://localhost:63342/Final_Proj/app/index.html";
var usersById = {};
var usersByFbId = {};
var usersByTwitId = {};
var usersByVKId = {};
var nextUserId = 0;
var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (app.get('env') == 'development') {
  app.use(logger('dev'));
} else {
  app.use(logger('default'));
}

function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

everyauth.everymodule.findUserById( function (id, callback){ callback(null, usersById[id])});

everyauth.facebook.appId(config.get('FB:appId')).appSecret(config.get('FB:appSecret'))
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {

      return usersByFbId[fbUserMetadata.id] || (usersByFbId[fbUserMetadata.id] = addUser('facebook', fbUserMetadata));
    }).redirectPath(registrationRedirectPatn);

everyauth.vkontakte.appId(config.get('VK:appId')).appSecret(config.get('VK:appSecret'))
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, fbUserMetadata) {

      return usersByVKId[fbUserMetadata.id] || (usersByVKId[fbUserMetadata.id] = addUser('vkontakte', fbUserMetadata));
    }).redirectPath(registrationRedirectPatn);

everyauth.twitter.consumerKey(config.get('TW:consumerKey')).consumerSecret(config.get('TW:consumerSecret'))
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {

      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
    }).redirectPath(registrationRedirectPatn);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log("MY STORE",store);

app.use(session({
  name: "sid",
  secret: config.get('session:secret'),
  //key: config.get('session:key'),
  //cookie: config.get('session:cookie'),
  store: store,
  resave: false,
  saveUninitialized: true
}));

app.use(everyauth.middleware());
app.use(require('./middleware/sendHttpError'));

require('./routes')(app);

app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
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

http.createServer(app).listen(config.get('port'), function(){
  log.info('Express server listening on port ' + config.get('port'));
});