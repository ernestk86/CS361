var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host : 'https://remotemysql.com:3306',
  user : '',
  password : 'MX6k6EWeA3',
  database : 'rgRFK7vG2e',
});

module.exports.pool = pool;
