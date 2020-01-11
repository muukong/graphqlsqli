
const express = require('express');
const expressgraphql = require('express-graphql');
const graphql = require('graphql');
const mysql = require('mysql2');

var dbconn = require('./mysql');

/* Initialize MySQL database */
const initdb = require('./initdb/initdb');

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

