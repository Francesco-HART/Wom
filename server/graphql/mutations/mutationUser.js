const graphql = require('graphql')
const {UserType} = require('../schemas/user')
const {Type} = require('../schemas/user')
const {AddressType} = require('../schemas/address')
const {GraphQLID, GraphQLNonNull, GraphQLString, GraphQLObjectType} = graphql
const User = require('../../models/user')
const Address = require('../../models/address')


exports.addUser =
    {
        type: UserType,
        args: {
            login: {type: new GraphQLNonNull(GraphQLID)},
            insta: {type: new GraphQLNonNull(GraphQLString)},
            list_address: {type: GraphQLID},
            email: {type: new GraphQLNonNull(GraphQLString)},
            phone_number: {type: new GraphQLNonNull(GraphQLString)},
            password: {type: new GraphQLNonNull(GraphQLString)},
           // preferences: {type: new GraphQLObjectType(GraphQLString)}
        },
        resolve(parent, args) {
        }
    }
