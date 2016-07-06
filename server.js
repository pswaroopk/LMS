#!/usr/bin/env node

/**
 * Check env and set default env
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */

var app = require('./express');
var orm = require('./orm');
var http = require('http');
var config = require('./config');
var assign = require('lodash').assign;

/**
 * Get port from environment and store in Express.
 */

var port = parseInt(process.env.PORT || config.port, 10);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Bind onError and onListening handler
 */

server.on('error', function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});

exports = module.exports = {

  start: function (ormConfig, done) {
    done = typeof ormConfig === 'function' ? ormConfig : done;
    ormConfig = ormConfig || {};

    ormConfig.defaults && ormConfig.defaults.connection
      ? orm.configureCollections(ormConfig.defaults.connection)
      : orm.configureCollections();

    /**
     * Init ORM and server listen on port
     */

    orm.initialize(assign(config.orm, ormConfig), function(err, models) {
      if (err) throw err;

      orm.models = models.collections;
      orm.connections = models.connections;

      /**
       * Listen on provided port, on all network interfaces.
       */
      server.listen(port, done);
    });
  },

  lower: function (done) {
    orm.teardown(function (err) {
      if(err) return done(err);
      return server.close(done);
    });
  }

};

if(!module.parent) {
  module.exports.start();
}
