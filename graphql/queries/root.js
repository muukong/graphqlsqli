
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
                return dbconn.promise().query(`SELECT * FROM users WHERE userid='${params.id}'`)
                .then( ([rows,fields] ) => {
                    
                    console.log('----------');
                    console.log(rows[0].name);
                    console.log('----------');

                    return { 
                        'id': rows[0].userid,
                        'name': rows[0].name,
                        'email': rows[0].name,
                    };
                })
                .catch(console.log);
            }
        },

        users: {
            type: GraphQLList(UserType),
            description: 'Returns list of all users',
            resolve: async (source,params) => {
                return dbconn.promise().query('SELECT * from users')
                .then( ([rows,fields]) => {

                    var users = [];
                    rows.forEach(row => {
                        users.push({ 
                            'id': row.userid,
                            'name': row.name,
                            'email': row.name,
                        });
                    }); 

                    return users;
                })
                .catch(console.log);
            }
        },

        post: {
            type: PostType,
            description: 'Returns a post by ID',
            args: {
                postid: { type: GraphQLInt }
            },
            resolve: async (source,params) => {

                const sql = `SELECT * FROM posts WHERE postid='${params.postid}'`;

                return dbconn.promise().query(sql)
                .then( ([rows,fields]) => {

                    return dbconn.promise().query(`SELECT * from users WHERE userid=${rows[0].userid}`)
                    .then( ([rows2,fields2]) => {
                         return {
                            'id': rows[0].postid,
                            'title': rows[0].title,
                            'body': rows[0].body,
                            'author': {
                                'id': rows2[0].userid,
                                'name': rows2[0].name,
                                'email': rows2[0].email
                            }
                        }
                    })
                    .catch(console.log);

                    /*
                    console.log('-------');
                    console.log(rows);
                    console.log('-------');
                    return {
                        'id': rows[0].postid,
                        'title': rows[0].title,
                        'body': rows[0].body,
                        'author': {
                            'id': 1,
                            'name': 'foo',
                            'email': 'bar'
                        }
                    }
                    console.log(rows); 
                    */
                })
                .catch(console.log);
            }
        },

        posts: {
            type: PostType,
            description: 'Returns list of posts',
            args: {
                title: { type: GraphQLString}
            },
            resolve: async (source,{title}) => {

                dbconn.query(`SELECT * FROM customers2 WHERE name='${title}'`, function(err, res, fields) {
                    if ( err ) throw err;
                    console.log(res);
                });
                return null;
            }
        }
    })
});

module.exports = QueryRootType;

