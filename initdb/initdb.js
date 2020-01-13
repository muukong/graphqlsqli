const dbconn = require('../mysql');
const fs = require('fs');

require('./generate-data');

function init_users() {
    const users = JSON.parse(fs.readFileSync('initdb/users.json')).users;
    users.forEach(function(user) {

        const sql = `INSERT INTO users (name,email,password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
        dbconn.query(sql, function(err) {
            if ( err ) throw err;
        });
    });
    console.log('[*] User table initialized');
}

function init_posts() {
        const posts = JSON.parse(fs.readFileSync('initdb/posts.json')).posts;
        posts.forEach(function(post) {
            const sql = `INSERT INTO posts (title,body,userid) VALUES ('${post.title}', '${post.body}', '${post.userid}')`
            dbconn.query(sql, function(err) {
                if ( err ) throw err;
            });
        });
        console.log('[*] Post table initialized');
}

/* Create table _users_ */
var sql = 'CREATE TABLE IF NOT EXISTS users (userid INT AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY(userid))';
dbconn.query(sql, function(err) {
    if ( err ) throw err;
    console.log('[*] User table created');
});

/* Create table _posts_ */
var sql = 'CREATE TABLE IF NOT EXISTS posts (postid INT AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), userid INT, PRIMARY KEY(postid))';
dbconn.query(sql, function(err) {
    if ( err ) throw err;
    console.log('[*] Post table created');
});

const dbname = dbconn.query('SELECT database()', function(err,res) {
    if ( err ) throw err;

    const dbname = res[0]['database()'];

    dbconn.query('SELECT * from users LIMIT 1', function(err,res) {
        if ( err ) throw err;
        if ( res.length == 0 )
            init_users();
    });

    dbconn.query('SELECT * FROM users LIMIT 1', function(err,res) {
        if ( err ) throw err;
        if ( res.length == 0 )
            init_posts();
    });
});

//const user_table_qry = `SELECT count(*) FROM information_schema.TABLES WHERE (TABLE_SCHEMA = '') AND (TABLE_NAME = 'name_of_table')`;

/* Add user data to table _users_ */

/* Add post data to table _posts_ */
/*
const posts = JSON.parse(fs.readFileSync('initdb/posts.json')).posts;
posts.forEach(function(post) {
    const sql = `INSERT INTO posts (title,body,userid) VALUES ('${post.title}', '${post.body}', '${post.userid}')`
    dbconn.query(sql, function(err) {
        if ( err ) throw err;
        //console.log('[*] Post added to _posts_ SQL table');
    });
});*/

/* Show all users */
/*
dbconn.query("SELECT * FROM users", function(err,res) {
    if ( err ) throw err;
});
*/



