const graphql = require("graphql");
const graphqDate = require("graphql-iso-date");

const { AddressType } = require("../schemas/address");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} = graphql;
const UserModel = require("../../models/user");
const AddressModel = require("../../models/address");
const { GratuityType } = require("../schemas/address");
const requireAuth = require("../../middlewares/requireAuth");
const requireAdmin = require("../../middlewares/requireAdmin");
const requireAddress = require("../../middlewares/requireAddress");
const { UserType } = require("../schemas/user");

const { GraphQLDate } = graphqDate;

exports.addUserAddress = {
  type: UserType,
  args: {
    expiration: { type: GraphQLNonNull(GraphQLDate) },
    id_address: { type: GraphQLNonNull(GraphQLString) },
    id_user: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        UserModel.findById(args.id_user).then(async (user) => {
          await requireAddress(user.type);
          AddressModel.findOne({ _id: args.id_address })
            .lean()
            .then(async (adress) => {
              const user_to_update = await User.findOne({
                _id: args.id_user,
              }).select("list_adress");
              // if the user already have the adress => do nothing
              if (
                user_to_update.list_address.findIndex(
                  (user_adress) =>
                    user_adress.address._id.toString() ===
                    args.id_address.toString()
                ) > 0
              )
                resolve(user_to_update);

              // find and update
              User.findOneAndUpdate(
                { _id: args.user_id },
                {
                  $push: {
                    list_address: { address: adress, ...args.expiration },
                  },
                },
                { new: true }
              );
            });
        });
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.updateUserAddressExpiration = {
  type: UserType,
  args: {
    id_address: { type: GraphQLNonNull(GraphQLString) },
    id_user: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.deleteUserAddress = {
  type: UserType,
  args: {
    id_address: { type: GraphQLNonNull(GraphQLString) },
    id_user: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        User.findOneAndUpdate(
          { _id: args.id_user },
          { $pull: { list_address: { "adress._id": args.id_address } } },
          { new: true }
        )
          .then((updated_user) => {
            return resolve(updated_user);
          })
          .catch((err) => reject(err.message));
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};
