const { Pool, Client } = require('pg');

let config;
if (!process.env.DB_HOST) {
  config = require('./config.js');
}

const { DB_HOST, DB_USER, DB_NAME, DB_PW, DB_PORT } = process.env;

module.exports = pool = new Pool({
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  user: DB_USER || config.DB_USER,
  database: DB_NAME || config.DB_NAME,
  password: DB_PW || config.DB_PW
});