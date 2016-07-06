var glob = require('glob');
var Waterline = require('waterline');
var config = require('./config');

var orm = new Waterline();

/**
 * This will load all models under ./models into the ORM
 */

var collections = glob.sync('./models/*').map(function(collection) {
  var name = collection.match(/\.\/models\/(.+)\.js/)[1];

  // Load collection
  collection = require(collection);

  // Assign filename as identity aka table name if non is set
  collection.identity = collection.identity || name;

  return collection;
});

orm.configureCollections = function (defaultConnection) {
  collections.forEach(function (collection) {
    // Assign connection to every model if non is set
    collection.connection = collection.connection || defaultConnection || config.orm.defaults.connection;
    orm.loadCollection(Waterline.Collection.extend(collection));
  })
};

module.exports = orm;
