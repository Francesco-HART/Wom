const graphql = require("graphql");
const { UserType } = require("../schemas/user");
const { Type } = require("../schemas/user");
const { GraphQLNonNull, GraphQLString } = graphql;
const requireAuth = require("../../middlewares/requireAuth");
const { signIn, signOut } = require("../../services/auth");

exports.signOut = {
  type: UserType,
  resolve: async (parent, args, context) => {
    await requireAuth(context);
    return signOut(context);
  },
};

exports.signIn = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    //pseudo: {type: new GraphQLNonNull(GraphQLString)},
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, { email, password }, context) {
    return signIn({ email, password, context });
  },
};

exports.fetchAuthUser = {
  type: UserType,
  resolve: async (parent, args, context) => {
    const user = await requireAuth(context);
    return user;
  },
};
