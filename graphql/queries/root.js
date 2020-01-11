
const { GraphQLInt, GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const UserType = require('./UserType');
const PostType = require('./PostType');

var dbconn = require('../../mysql');

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
                return { 
                    'id': rows[0].userid,
                    'name': rows[0].name,
                    'email': rows[0].name,
                };

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
                    'author': {
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

                const query = 'SELECT * FROM posts';
                const [rows,fields] = await dbconn.promise().query(query);

                var posts = [];
                rows.forEach(row => {
                    posts.push({
                        'id': row.postid,
                        'title': row.title,
                        'body': rows.body,
                        'author': {
                            'id': 1,
                            'name': 'hello',
                            'email': 'foo'
                        }
                    });
                });

                return posts;
            }
        }
    })
});

module.exports = QueryRootType;

