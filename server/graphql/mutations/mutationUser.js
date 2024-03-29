const graphql = require("graphql");
const { UserType } = require("../schemas/user");
const { Type } = require("../schemas/user");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLObjectType } = graphql;
const UserModel = require("../../models/user");
const UserLogsModel = require("../../models/actions/userLogs");
const requireAdmin = require("../../middlewares/requireAdmin");
const requireAuth = require("../../middlewares/requireAuth");
const bcrypt = require("bcryptjs");

exports.createUser = {
  type: UserType,
  args: {
    login: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    type: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone_number: { type: GraphQLNonNull(GraphQLString) },
    insta: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);

        await requireAdmin(auth_user.type);
        console.log("icii");

        await new UserModel(args)
          .save()
          .then((new_user) => {
            resolve(new_user);
          })
          .catch((err) => {
            if (err.code === 11000)
              reject(
                Error(
                  "login ou email ou phoneNumber ou pseudo insta déjà utilisé"
                )
              );
            reject(Error(err));
          });
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.updateUser = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    login: { type: GraphQLString },
    type: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    insta: { type: GraphQLString },
  },
  resolve: async (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        UserModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
          .then((updated_user) => {
            new UserLogsModel({
              type: "create_user",
              user: auth_user.id,
              target: { login: updated_user.login },
            }).save();
            resolve(updated_user);
          })
          .catch((err) => {
            if (err.code === 11000) return reject(Error("Login déjà utilisé"));
            reject(Error(err));
          });
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.updateUserPwd = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        //TOTO
        bcrypt.hash(args.password, 10, (bcryptErr, hash) => {
          if (bcryptErr) return reject(Error(bcryptErr));
          UserModel.findOneAndUpdate(
            { _id: args.id },
            { password: hash },
            { new: true }
          )
            .then((updated_user) => {
              new UserLogsModel({
                type: "update_user_password",
                user: auth_user.id,
                target: { login: updated_user.login },
              }).save();
              resolve(updated_user);
            })
            .catch((err) => {
              reject(Error(err));
            });
        });
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.deleteUser = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);

        UserModel.findOneAndDelete({ _id: args.id })
          .then((deleted_user) => {
            new UserLogsModel({
              type: "delete_user",
              user: auth_user.id,
              target: { login: deleted_user.login },
            }).save();
            resolve(deleted_user);
          })
          .catch((err) => {
            reject(Error(err));
          });
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.verifIsFollower = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (true) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};
