const mysql = require('mysql2');

var dbconn = mysql.createConnection({
    host: 'mysqldb',
    port: '3306', 
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbconn.connect(function(err) {
    if ( err ) throw err;
    console.log('[*] Connected to MySQL database.');
});

module.exports = dbconn;

