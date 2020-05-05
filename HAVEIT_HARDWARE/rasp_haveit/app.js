var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http').Server(app);
var ngrok = require('ngrok');

// var bodyParser = require('body-parser');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
//console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
// 2020-01-28 15:09:17


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var serverRouter = require('./routes/server');
var recvRouter = require('./routes/alarm');
var sendRouter = require('./routes/send');
var dataRouter = require('./routes/data');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var receiveRouter = require('./routes/receive');
var dateRouter = require('./routes/date');
var habitRouter = require('./routes/habit');

const { sequelize } = require('./models');

var app = express();

sequelize.sync();
app.set('port', process.env.PORT || 8001);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/server', serverRouter);
app.use('/alarm', recvRouter);
app.use('/send', sendRouter);
app.use('/data', dataRouter);
app.use('/login', loginRouter);
//app.use('/register', registerRouter);
app.use('/receive', receiveRouter);
app.use('/date', dateRouter);
app.use('/habit', habitRouter);
// const ngrok = require('ngrok');


/* ngrok */
registerRouter.regist();

//app.use('/alarm_controller', controllerRouter);


//app.use('/entire', entireRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
