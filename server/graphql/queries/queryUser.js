const graphql = require("graphql");
const { GraphQLList, GraphQLID } = graphql;
const { UserType } = require("../schemas/user");
const UserModel = require("../../models/user");
const requireAuth = require("../../middlewares/requireAuth");
const requireAdmin = require("../../middlewares/requireAdmin");

exports.fetchUsers = {
  type: GraphQLList(UserType),
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    await requireAdmin(auth_user.type);
    return UserModel.find();
  },
};

//add promise
exports.fetchUser = {
  type: UserType,
  args: { id: { type: GraphQLID } },
  resolve: async (parent, args, context) => {
    const auth_user = await requireAuth(context);
    if (auth_user.type !== "admin" && auth_user.id !== args.id)
      throw Error("Vous ne pouvez pas recuperer cet utilisateur");
    return UserModel.findById(args.id);
  },
};
