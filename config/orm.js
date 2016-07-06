// Require any waterline compatible adapters here
var memoryAdapter = require('sails-memory');
var postgresAdapter = require('sails-postgresql');

// Build A Config Object
module.exports.orm = {

  // Setup Adapters
  // Creates named adapters that have have been required
  adapters: {
    'default': memoryAdapter,
    memory: memoryAdapter,
    postgres: postgresAdapter
  },

  // Build Connections Config
  // Setup connections using the named adapter configs
  connections: {

    localMemory: {
      adapter: 'memory'
    },

    localPostgres: {
      adapter: 'postgres',
      host: 'localhost',
      database: 'libraryservice',
      user: 'postgres',
      password:'1234'
    }

  },

  defaults: {
    connection: 'localPostgres',
    migrate: 'alter'
  }

};
