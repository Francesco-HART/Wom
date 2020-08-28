const graphql = require("graphql");
const { AddressType } = require("../schemas/address");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } = graphql;
const UserModel = require("../../models/user");
const AddressModel = require("../../models/address");

const requireAuth = require("../../middlewares/requireAuth");
const requireMyAddress = require("../../middlewares/requireMyAddress");
const requireAdmin = require("../../middlewares/requireAdmin");

exports.createAddress = {
  type: UserType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLNonNull(GraphQLString) },
    gratuity: { type: GraphQLNonNull(GraphQLList(GraphQLString)) },
    email: { type: GraphQLNonNull(GraphQLString) },
    phone_number: { type: GraphQLNonNull(GraphQLString) },
    validation_code: { type: GraphQLNonNull(GraphQLString) },
    user_id: { type: GraphQLID },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      // save new user
      //asign to user
      const auth_user = await requireAuth(context);
      requireAdmin(auth_user.type);

      new AddressModel(args)
        .save()
        .then((created_address) => {
          try {
            if (args.user_id) {
              const user_to_update = await UserModel.findById(args.user_id);
              if (user_to_update.type !== "address")
                reject("il s'agit d'un utilisateur");
              const user_updated = await UserModel.findOneAndUpdate(
                { _id: args.user_id },
                {
                  list_address: [
                    user_to_update.list_address,
                    created_address._id,
                  ],
                }
              );
            }
            resolve(created_address);
          } catch (err) {
            reject(err);
          }
        })
        .catch((err) => {
          if (err.code === 11000) return reject(Error("Login déjà utilisé"));
          reject(Error(err));
        });
    });
  },
};

exports.updateAddress = {
  type: UserType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    gratuity: { type: GraphQLList(GraphQLString) },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    validation_code: { type: GraphQLString },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      if (args.validation_code) await requireAdmin(auth_user.type);
      await requireMyAddress(auth_user.type);
      AddressModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
        .then((updated_user) => {
          new UserLogsModel({
            type: "create_user",
            user: auth_user.id,
            target: { login: updated_user.login },
          }).save();
          resolve(updated_user);
        })
        .catch((err) => {
          if (err.code === 11000) return reject(Error("element déjà utilisé"));
          reject(Error(err));
        });
    });
  },
};

exports.deleteAddress = {
  type: AddressType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      await requireAdmin(auth_user.type);
      await requireMyAddress(auth_user, args.id);
      AddressModel.findOneAndDelete({ _id: args.id })
        .then((deleted_user) => {
          resolve(deleted_user);
        })
        .catch((err) => {
          reject(Error(err));
        });
    });
  },
};
