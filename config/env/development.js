var postgresAdapter = require('sails-postgresql');
module.exports = {
  port: 3000,
  orm: {
    adapters: {
      postgres: postgresAdapter
    },
    connections: {
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
  }
};
