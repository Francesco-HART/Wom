const graphql = require("graphql");
const graphqDate = require("graphql-iso-date");
const UserType = require("./user");
const UserLogsModel = require("../../models/userLogs");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLEnumType,
} = graphql;
const { GraphQLDateTime } = graphqDate;

const Type = new GraphQLEnumType({
  name: "Type",
  values: {
    create_user: { value: "create_user" },
    update_user: { value: "update_user" },
    update_user_password: { value: "update_user_password" },
    delete_user: { value: "delete_user" },
    update_account: { value: "update_account" },
    add_user_address: { value: "add_user_address" },
    update_user_address: { value: "update_user_address" },
    delete_user_address: { value: "delete_user_address" },
    update_account_password: { value: "update_account_password" },
  },
});

const UserTargetType = new GraphQLObjectType({
  name: "Target",
  fields: () => ({
    login: { type: GraphQLString },
  }),
});

module.exports = new GraphQLObjectType({
  name: "userLogs",
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: Type },
    description: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    target: { type: UserTargetType },
    user: {
      type: UserType,
      resolve(parent) {
        return UserLogsModel.findById(parent.id)
          .populate("user")
          .then((userLog) => userLog.user);
      },
    },
  }),
});
