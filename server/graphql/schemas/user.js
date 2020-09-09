const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
} = graphql;

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
      type: new GraphQLList(AddressType),
      resolve(parent, args) {
        return UserModel.findById(parent.id)
          .populate("list_address")
          .then((user) => user.group);
      },
    },
    type: { type: Type },
  }),
});
