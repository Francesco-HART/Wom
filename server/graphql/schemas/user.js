const graphql = require("graphql");
const graphqDate = require("graphql-iso-date");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
} = graphql;
const { GraphQLDate } = graphqDate;
const { AddressType } = require("./address");
const { UserModel } = require("../../models/user");

const Type = new GraphQLEnumType({
  name: "TypeUser",
  values: {
    user: {
      value: "user",
    },
    admin: {
      value: "admin",
    },
    address: {
      value: "address",
    },
  },
});

exports.Type = Type;

const UserAddressType = new GraphQLObjectType({
  name: "UserAddress",
  fields: () => ({
    address: {
      type: AddressType,
      resolve(parent, args) {
        return UserModel.findById(parent.id)
          .populate("list_address")
          .then((user) => user.group);
      },
    },
    expiration: { type: GraphQLDate },
  }),
});

exports.UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    password: { type: GraphQLString },
    login: { type: GraphQLString },
    insta: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    address: { type: GraphQLString },
    email: { type: GraphQLString },
    list_address: {
      type: new GraphQLList(UserAddressType),
    },
    type: { type: Type },
  }),
});
