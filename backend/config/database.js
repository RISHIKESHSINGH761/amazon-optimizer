const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME,
  process.env.MYSQLUSER || process.env.DB_USER,
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    logging: false
  }
);

module.exports = { sequelize };