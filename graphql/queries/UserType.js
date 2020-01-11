const { GraphQLString, GraphQLObjectType, GraphQLList, GraphQLNonNull } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: "This represents a user",
    fields: () => ({
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: { type: new GraphQLList(require('./PostType')) }
    })
});

module.exports = UserType;

