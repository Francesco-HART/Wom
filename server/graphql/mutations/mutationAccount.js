const graphql = require("graphql");
const bcrypt = require("bcryptjs");
const UserType = require("../schemas/user");
const UserModel = require("../../models/user");
const UserLogsModel = require("../../models/userLogs");
const { GraphQLNonNull, GraphQLString } = graphql;
const requireAuth = require("../../middlewares/requireAuth");

exports.updateAccount = {
  type: UserType,
  args: {
    login: { type: GraphQLString },
    type: { type: GraphQLString },
    email: { type: GraphQLString },
    insta: { type: GraphQLString },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      if (args.type !== "user") {
        await requireAdmin(auth_user.type);
      }
      UserModel.findOneAndUpdate({ _id: auth_user.id }, args, {
        new: true,
      })
        .then(async (updated_account) => {
          await new UserLogsModel({
            type: "update_account",
            user: auth_user.id,
          }).save();
          resolve(updated_account);
        })
        .catch((err) => {
          reject(Error(err));
        });
    });
  },
};

exports.updateAccountPwd = {
  type: UserType,
  args: {
    current_password: { type: GraphQLNonNull(GraphQLString) },
    new_password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      const user = await UserModel.findById(auth_user.id)
        .select("+password")
        .lean();
      bcrypt.compare(args.current_password, user.password, function (
        bcryptCompareErr,
        isMatch
      ) {
        if (bcryptCompareErr) return reject(Error(bcryptCompareErr));
        if (!isMatch) return reject(Error("Mot de passe actuel incorrect"));
        bcrypt.hash(args.new_password, 10, (bcryptHashErr, hash) => {
          if (bcryptHashErr) return reject(Error(bcryptHashErr));
          UserModel.findOneAndUpdate({ _id: user._id }, { password: hash })
            .then(async (updated_account) => {
              await new UserLogsModel({
                type: "update_account_password",
                user: user._id,
              }).save();
              resolve(updated_account);
            })
            .catch((err) => {
              reject(Error(err));
            });
        });
      });
    });
  },
};
