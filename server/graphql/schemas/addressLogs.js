const graphql = require("graphql");
const graphqDate = require("graphql-iso-date");
const UserType = require("./user");
const AddressLogsModel = require("../../models/addressLogs");
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
    create_address: { value: "create_address" },
    update_address: { value: "update_address" },
    delete_address: { value: "delete_address" },
  },
});

const GroupTargetType = new GraphQLObjectType({
  name: "GroupType",
  fields: () => ({
    name: { type: GraphQLString },
  }),
});

module.exports = new GraphQLObjectType({
  name: "GroupLogs",
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: Type },
    description: { type: GraphQLString },
    date: { type: GraphQLDateTime },
    target: { type: GroupTargetType },
    user: {
      type: UserType,
      resolve(parent, args) {
        return AddressLogsModel.findById(parent.id)
          .populate("user")
          .then((addressLogs) => addressLogs.user);
      },
    },
  }),
});
