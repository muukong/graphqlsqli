const { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLList, GraphQLNonNull } = require('graphql');

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: "This represents a user",
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: { type: new GraphQLList(require('./PostType')) }
    })
});

module.exports = UserType;

