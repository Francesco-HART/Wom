const graphql = require("graphql");
const { GraphQLNonNull, GraphQLString, GraphQLList } = graphql;
const UserLogsType = require("../schemas/userLogs");
const UserLogsModel = require("../../models/userLogs");
const GroupModel = require("../../models/group");
const requireAuth = require("../../middlewares/requireAuth");
const requireAdmin = require("../../middlewares/requireAdmin");

exports.fetchUserLogs = {
  type: UserLogsType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, { id }, context) => {
    const auth_user = await requireAuth(context);
    await requireAdmin(auth_user.type);
    return UserLogsModel.findById(id);
  },
};

exports.fetchUsersLogs = {
  type: GraphQLList(UserLogsType),
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    await requireAdmin(auth_user.type);
    return UserLogsModel.find().sort({ _id: -1 });
  },
};
