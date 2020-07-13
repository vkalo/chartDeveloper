var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');  //我是新引入的ejs插件

require('./serve/webSocket');

var indexRouter = require('./routes/index');
var configRouter = require('./routes/config');
var saveRouter = require('./routes/save');
var posterRouter = require('./routes/poster');
var dataRouter = require('./routes/data');
// 中间件
var moduleMiddle = require('./middle/module');

var app = express();

// view engine setup
app.engine('html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/config', configRouter);
app.use('/save', saveRouter);
app.use('/chart',moduleMiddle);
app.use('/poster',posterRouter);
app.use('/data',dataRouter);

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
