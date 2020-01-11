const fs = require('fs');

const nof_users = 5
const nof_posts = 10

/* Generate user list */
var users = {
    "users": []
};
for ( var i = 1; i <= nof_users; ++i ) {
    const user = {
        "name": `User_${i}`,
        "email": `user_${i}@example.com`,
        "password": `password${i}.123`
    }
    users['users'].push(user);
}
fs.writeFileSync('initdb/users.json', JSON.stringify(users));

/* Generate post list */
var posts = {
    "posts": []
}
for ( var i = 1; i <= nof_posts; ++i ) {
    const post = {
        "title": `Title_${i}`,
        "body": `Body_${i}`,
        "userid": Math.floor(Math.random() * nof_users)
    }; 
    posts['posts'].push(post);
}
fs.writeFileSync('initdb/posts.json', JSON.stringify(posts));

