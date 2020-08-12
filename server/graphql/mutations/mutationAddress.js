const graphql = require('graphql')
const {AddressType} = require('../schemas/address')
const {GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList} = graphql
const User = require('../../models/user')
const Address = require('../../models/address')


exports.addAddress =
    {
        type: AddressType,
        args: {
            name: {type: new GraphQLNonNull(GraphQLString)},
            address: {type: new GraphQLNonNull(GraphQLString)},
            gratuity: {type: new GraphQLList(GraphQLString)},
            email: {type: new GraphQLNonNull(GraphQLString)},
            phone_number: {type: new GraphQLNonNull(GraphQLString)},
            validation_code: {type: new GraphQLNonNull(GraphQLString)},
            //parent_id
        },
        resolve(parent, args) {
        }
    }
