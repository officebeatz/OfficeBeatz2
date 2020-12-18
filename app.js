var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')();
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var sharedsession = require("express-socket.io-session");
var actual_session = session({secret: "sadhsafhsfsajf", cookie: {maxAge: 7*24*3600*1000, secure:false}});


// load dev environment variables (BEFORE setting routes)
if (process.env.NODE_ENV == 'dev') {
    console.log("Loading dev .env variables");
    require('dotenv').config();
}

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser);

app.use(actual_session);
app.disable('view cache');
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/**
 * Passes 404 errors to the error handler.
 * @param {NextFunction} next
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Error handler
 * @param {any} err The error itself
 * @param {any} req
 * @param {any} res
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.use(sharedsession(actual_session,{
  autoSave:true
}));

var utils = require('./routes/utils');

io.on('connection', function(socket){
  console.log('a user connected: ' + socket.handshake.session.id);
  socket.on('disconnect', function(){
    if (socket.handshake.session.fire_key) {
      //utils.UpdateOffPageViewDiff(socket.handshake.session.fire_key, socket.handshake.session.id);
      if (socket.handshake.session.pageViewDate && socket.handshake.session.function_set) {

        utils.checkLogout(socket.handshake.session.fire_key,socket.handshake.session.id).then(function(has_logout){
          if (has_logout)
          {
            socket.handshake.session.function_set = false;
            utils.setLogOut(socket.handshake.session.fire_key,socket.handshake.session.id,false);
          }
          else {
            utils.updateTime(socket.handshake.session.fire_key, (new Date() - socket.handshake.session.pageViewDate) / 1000);
            socket.handshake.session.pageViewDate = null;
          }
        });

      }

    }
    console.log('a user disconnected: ' + socket.handshake.session.id);
  });
  socket.handshake.session.pageViewDate = new Date();
  utils.updatePageViewTime(socket.handshake.session.fire_key,socket.handshake.session.id,new Date());
});

module.exports = server;
