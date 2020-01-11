
const { GraphQLInt, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const UserType = require('./UserType');
const PostType = require('./PostType');

var dbconn = require('../../mysql');

async function posts_by_user(userid) {
    //console.log('[-] user_by_id');

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
    //console.log('[-] user_by_id');

    const [rows,fields] = await dbconn.promise().query(`SELECT * FROM users WHERE userid='${userid}'`);

    /*
    const post_query = `SELECT * FROM posts WHERE userid=${rows[0].userid}`;
    const [post_rows,post_fields] = await dbconn.promise().query(post_query);
    */

    var user = {
        'id': rows[0].userid,
        'name': rows[0].name,
        'email': rows[0].name,
        'posts': async function thunk() {
            return posts_by_user(rows[0].userid);
        }
    }
    return user;
}

const QueryRootType = new GraphQLObjectType({
    name: 'AppSchema',
    description: 'GraphQL Test Query.',
    fields: () => ({

        user: {
            type: UserType,
            description: 'List all users.',
            args: {
                id: { type: GraphQLInt },
            },
            resolve: async (source,params) => {

                const [rows,fields] = await dbconn.promise().query(`SELECT * FROM users WHERE userid='${params.id}'`);

                const post_query = `SELECT * FROM posts WHERE userid=${rows[0].userid}`;
                const [post_rows,post_fields] = await dbconn.promise().query(post_query);

                var user = {
                    'id': rows[0].userid,
                    'name': rows[0].name,
                    'email': rows[0].name,
                    'posts': async function thunk() {
                                return posts_by_user(rows[0].userid);
                             }
                };

                return user;
            }
        },

        post: {
            type: PostType,
            description: 'Returns a post by ID',
            args: {
                postid: { type: GraphQLInt }
            },
            resolve: async (source,params) => {
                const post_query = `SELECT * FROM posts WHERE postid='${params.postid}'`;
                const [post_rows,post_fields] = await dbconn.promise().query(post_query);

                const user_query = `SELECT * from users WHERE userid=${post_rows[0].userid}`;
                const [user_rows,user_fields] = await dbconn.promise().query(user_query);

                 return {
                    'id': post_rows[0].postid,
                    'title': post_rows[0].title,
                    'body': post_rows[0].body,
                    'user': {
                        'id': user_rows[0].userid,
                        'name': user_rows[0].name,
                        'email': user_rows[0].email
                    }
                }
            }
        },

        posts: {
            type: GraphQLList(PostType),
            description: 'Returns list of posts',
            resolve: async (source,params) => {

                console.log('---- source ----');
                console.log(source);
                console.log('---- source ----');

                const query = 'SELECT * FROM posts';
                const [rows,fields] = await dbconn.promise().query(query);


                var posts = [];
                rows.forEach(row => {
                    posts.push({
                        'id': row.postid,
                        'title': row.title,
                        'body': rows.body,
                        'user': function thunk() {
                            return 'hello'; //user_by_id(1);  // FIXME
                        }
                    });
                });

                return posts;
            }
        }
    })
});

module.exports = QueryRootType;

