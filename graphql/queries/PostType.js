const { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLNonNull } = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'PostType',
    description: "This represents a user's post",
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        body: { type: GraphQLString }, 
        user: { type: require('./UserType') } /* Author of post */
    })
});

module.exports = PostType;

