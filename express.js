var express = require('express');
// var cors = require('cors');
// var path = require('path');
// var logger = require('morgan');
// var colors = require('colors');
var bodyParser = require('body-parser');
var config = require('./config');
var glob = require('glob');
var routers = glob.sync('./routes/*.js');
var app = express();


// if(config.log.level) {
//   app.use(logger(config.log.level));
// }

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(config.urls.prefix + '/doc', express.static(path.join(__dirname, 'apidoc')));

// app.use(cors(config.cors));
// book.js
// /book
routers.forEach(function(router) {
  var name = router.split('/');
  router = require(router);
  name = name[name.length - 1].split('.')[0];
  name = name === 'index' ? '' : name;
  name = '/' + name;
  console.log(name);
  app.use(name, router);
});

// Make sure Opsworks health check does not fail
app.get('/', function(req, res) {
  res.sendStatus(200);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res) {
  console.log(colors.red(err.stack));

  res.status(err.status || 500);
  res.json({
    message: err.message,

    // on production no stacktraces leaked to user
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
