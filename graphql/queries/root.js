
const { GraphQLInt, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const UserType = require('./UserType');
const PostType = require('./PostType');

var dbconn = require('../../mysql');

async function posts_by_user(userid) {

    const post_query = `SELECT * FROM posts WHERE userid=${userid}`;
    const [post_rows,post_fields] = await dbconn.promise().query(post_query);

    posts = [];
    post_rows.forEach(row => {
        posts.push({
            'id': row.postid,
            'title': row.title,
            'body': row.body,
            'user': async function thunk() {
                return user_by_id(row.userid);
            }
        });
    });

    return posts;
}

async function user_by_id(userid) {

    const [rows,fields] = await dbconn.promise().query(`SELECT * FROM users WHERE userid='${userid}'`);

    var user = {
        'id': rows[0].userid,
        'name': rows[0].name,
        'email': rows[0].email,
        'posts': async function thunk() {
            return posts_by_user(rows[0].userid);
        }
    }
    return user;
}

async function all_users() {

    const [rows,fields] = await dbconn.promise().query('SELECT * from users');

    var users = [];
    rows.forEach(row => {
        users.push({
            'id': row.userid,
            'name': row.name,
            'email': row.email,
            'posts': async function thunk() {
                return posts_by_user(row.userid); 
            }
        }); 
    });

    return users;
}

async function post_by_id(postid) {

    const post_query = `SELECT * FROM posts WHERE postid='${postid}'`;
    const [post_rows,post_fields] = await dbconn.promise().query(post_query);

    return {
        'id': post_rows[0].postid,
        'title': post_rows[0].title,
        'body': post_rows[0].body,
        'user': function thunk() {
            return user_by_id(post_rows[0].userid);
         }
    }
}

async function all_posts() {

    const [rows,fields] = await dbconn.promise().query('SELECT * from posts');
    var posts = [];
    rows.forEach(row => {
        posts.push({
            'id': row.postid,
            'title': row.title,
            'body': row.body,
            'user': async function thunk() {
                return user_by_id(row.userid);
            }
        }); 
    });
    
    return posts;
}

const QueryRootType = new GraphQLObjectType({
    name: 'AppSchema',
    description: 'GraphQL Test Query.', fields: () => ({

        user: {
            type: UserType,
            description: 'List all users.',
            args: {
                id: { type: GraphQLString },
            },
            resolve: async (source,params) => { return user_by_id(params.id); }
        },

        users: {
            type: GraphQLList(UserType),
            description: 'Returns all users',
            resolve: async (source,params) => { return all_users(); }
        },

        post: {
            type: PostType,
            description: 'Returns a post by ID',
            args: {
                postid: { type: GraphQLInt }
            },
            resolve: async (source,params) => { return post_by_id(params.postid); }
        },

        posts: {
            type: GraphQLList(PostType),
            description: 'Returns list of posts',
            resolve: async (source,params) => { return all_posts(); }
        }
    })
});

module.exports = QueryRootType;

