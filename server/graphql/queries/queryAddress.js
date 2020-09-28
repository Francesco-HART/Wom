const graphql = require("graphql");
const { GraphQLList, GraphQLID } = graphql;
const { AddressType } = require("../schemas/address");
const AddressModel = require("../../models/address");
const UserModel = require("../../models/user");
const requireAuth = require("../../middlewares/requireAuth");
const requireAddress = require("../../middlewares/requireAddress");
const requireMyAddress = require("../../middlewares/requireMyAddress");

exports.fetchAddress = {
  type: GraphQLList(AddressType),
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    await requireAddress(auth_user.type);
    let params = {};
    if (auth_user.type === "address") {
      const user_address = await UserModel.findById(auth_user.id).select(
        "list_address"
      );
      params = { _id: { $in: user_address } };
    }
    return AddressModel.find(params).sort({ _id: -1 });
  },
};

exports.fetchOneAddress = {
  type: AddressType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    await requireAddress(auth_user.type);
    await requireMyAddress(auth_user, args.id);
    return AddressModel.findById(args.id);
  },
};
