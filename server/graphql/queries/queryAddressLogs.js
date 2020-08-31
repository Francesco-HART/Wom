const graphql = require("graphql");
const { GraphQLNonNull, GraphQLString, GraphQLList } = graphql;
const { AddressLogsType } = require("../schemas/addressLogs");
const AddressLogsModel = require("../../models/addressLogs");
const UserModel = require("../../models/user");
const requireAuth = require("../../middlewares/requireAuth");
const requireAdmin = require("../../middlewares/requireAdmin");
const requireAddress = require("../../middlewares/requireAddress");
const userLogs = require("../schemas/userLogs");

exports.fetchOneAddressLogs = {
  type: AddressLogsType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, { id }, context) => {
    const auth_user = await requireAuth(context);
    await requireAdmin(auth_user.type);
    return AddressLogsModel.findById(id);
  },
};

exports.fetchAddressLogs = {
  type: GraphQLList(AddressLogsType),
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    await requireAddress(auth_user.type);
    let params = {};
    if (auth_user.type === "address") {
      const user = await UserModel.findById(auth_user.id);
      params = { target: { $in: user.list_address } };
    }
    return AddressLogsModel.find(params).sort({ _id: -1 });
  },
};
