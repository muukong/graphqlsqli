
const { GraphQLString, GraphQLList, GraphQLObjectType } = require('graphql');
const UserType = require('./UserType');
const PostType = require('./PostType');

var dbconn = require('../../mysql');

const QueryRootType = new GraphQLObjectType({
    name: 'AppSchema',
    description: 'GraphQL Test Query.',
    fields: () => ({

        users: {
            type: UserType,
            description: 'List all users.',
            resolve: async (source,params) => {

                /*                
                const data = {
                    name: 'foo',
                    email: 'foo@example.com',
                    password: 'foo.123'
                };

                return data;
                */
                return null;
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

