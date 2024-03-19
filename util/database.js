// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'nodejs',
// });

// module.exports = pool.promise();

const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodejs', 'root', '', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
