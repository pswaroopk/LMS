var glob = require('glob');
var _ = require('lodash');

/**
 * This module will load all config files in ./config
 * and return them as one object
 */

var config = [{}];

// Get List of all config
var files = glob.sync('./config/*.js', { ignore: ['./config/index.js', './config/local.js'] });

// Require all configurations and push them into the config array
files = files.forEach(function(file) {
  config.push(require('.' + file.slice(8)));
});

// Transform config array into an object containing all elements
config = _.assign.apply(this, config);

// load environment configuration
try {
  var env = require('./env/' + process.env.NODE_ENV + '.js');
  _.merge(config, env);
} catch(e) {}

module.exports = config;
