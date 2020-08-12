const graphql = require("graphql");
const { UserType } = require("../schemas/user");
const UserModel = require("../../models/user");
const { Type } = require("../schemas/user");
const { GraphQLNonNull, GraphQLString } = graphql;
const requireAuth = require("../../middlewares/requireAuth");
const { signIn, signOut } = require("../../services/auth");

exports.signUp = {
  type: UserType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    login: { type: new GraphQLNonNull(GraphQLString) },
    insta: { type: new GraphQLNonNull(GraphQLString) },
    phone_number: { type: new GraphQLNonNull(GraphQLString) },
    type: { type: new GraphQLNonNull(Type) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(
    parent,
    { email, password, login, insta, phone_number, type },
    context
  ) {
    new UserModel({
      email,
      password,
      login,
      insta,
      phone_number,
      type,
    })
      .save()
      .then((new_user) => {
        return new_user;
      });
  },
};

exports.signOut = {
  type: UserType,
  resolve: async (parent, args, context) => {
    await requireAuth(context);
    return signOut();
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
