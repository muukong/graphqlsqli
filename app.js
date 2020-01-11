
const express = require('express');
const expressgraphql = require('express-graphql');
const graphql = require('graphql');
const mysql = require('mysql2');

/*
console.log(`User : ${process.env.MYSQL_USER}`)
console.log(`Password: ${process.env.MYSQL_PASSWORD}`);
console.log('DB: ' + process.env.MYSQL_DATABASE);
*/

var dbconn = require('./mysql');

/* Initialize MySQL database */
const initdb = require('./initdb/initdb');


/*
var dbconn = mysql.createConnection({
    host: 'db',
    port: '3306',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

dbconn.connect(function(err) {
    if ( err ) throw err;
    console.log('[*] Connected to MySQL database.');
});
*/

/*
const sql = 'CREATE TABLE customers2 (name VARCHAR(255), address VARCHAR(255))';
dbconn.query(sql, function(err, res) {
    if ( err ) throw err;
    console.log('[*] Table created');
});
*/

/*
for ( var i = 0; i < 10; ++i ) {
    var user = 'user' + i;
    var address = 'address' + i;
    const sql = `INSERT INTO customers2 (name,address) VALUES ('${user}', '${address}')`;
    dbconn.query(sql, function(err, res) {
        if ( err ) throw err;
        console.log('[*] Inserted');
    });
}*/

/*
dbconn.query('SELECT * FROM customers2', function(err, res, fields) {
    if ( err ) throw err;
    console.log(res);
});*/

/*
dbconn.connect(function(err) {
    if ( err ) throw err;
    console.log('[*] Connected to MySQL database.');
});*/

//const port = process.env.PORT || 8888;
const port = 8080;

const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req,res) {
    res.send('hello');
});

/* GraphQL */

const RootQueryType = require('./graphql/queries/root');
const AppSchema = new graphql.GraphQLSchema({
    query: RootQueryType
});

app.use('/graphql', expressgraphql({
    schema: AppSchema,
    graphiql: true   
}));

app.listen(port, function() {
    console.log(`[*] GraphQL SQLI Demo listening on port ${port}.`);
});

