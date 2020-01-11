const { GraphQLString, GraphQLObjectType, GraphQLNonNull } = require('graphql');

const PostType = new GraphQLObjectType({
    name: 'PostType',
    description: "This represents a user's post",
    fields: () => ({
        title: { type: GraphQLString },
        body: { type: GraphQLString }, 
        author: { type: require('./UserType') }
    })
});

module.exports = PostType;

