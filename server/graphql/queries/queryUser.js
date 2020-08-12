const graphql = require("graphql");
const { UserType } = require("../schemas/user");
const { GraphQLID } = graphql;

exports.fetchUsers = {
  type: UserType,
  resolve(parent, args) {
    return null;
  },
};

exports.fetchUser = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return args.id;
  },
};
