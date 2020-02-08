var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  timeout         : 10000,
  host            : 'remotemysql.com',
  user            : 'rgRFK7vG2e',
  password        : 'MX6k6EWeA3',
  database        : 'rgRFK7vG2e'
});

module.exports.pool = pool;
