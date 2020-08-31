const graphql = require("graphql");
const { AddressType } = require("../schemas/address");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } = graphql;
const UserModel = require("../../models/user");
const AddressModel = require("../../models/address");
const { GratuityType } = require("../schemas/address");
const requireAuth = require("../../middlewares/requireAuth");
const requireMyAddress = require("../../middlewares/requireMyAddress");
const requireAdmin = require("../../middlewares/requireAdmin");

exports.createAddress = {
  type: AddressType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    gratuities: { type: GraphQLNonNull(GraphQLList(GratuityType)) },
    image: { type: GraphQLString },
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
        .then(async (created_address) => {
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
  type: AddressType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    gratuities: { type: GraphQLList(GratuityType) },
    image: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    validation_code: { type: GraphQLString },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      let update = false;
      if (args.validation_code) await requireAdmin(auth_user.type);
      await requireMyAddress(auth_user.type);
      AddressModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
        .then((updated_address) => {
          updated_address = updated_address.gratuites.map((gratuity) => {
            if (gratuity) {
              if (gratuity.remaining_capacity === 0) {
                update = true;
                gratuity.available = false;
              }
            }
            return gratuity;
          });
          if (update) {
            AddressModel.findOneAndUpdate(
              { _id: args.id },
              { gatuities: updated_address.gratuites },
              {
                new: true,
              }
            )
              .then((updated_address) => {
                resolve(updated_address);
              })
              .catch((err) => {
                reject(Error(err));
              });
          }
          resolve(updated_address);
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

exports.resetGratuities = {
  type: AddressType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      await requireMyAddress(auth_user, args.id);
      AddressModel.findById(args.id)
        .then((address) => {
          address.gratuities.map((gratuity) => {
            if (gratuity && gratuities.capacity) {
              gratuity.remaining_capacity = gratuity.capacity;
              gratuity.available = true;
              return gratuity;
            }
          });
          resolve(address);
        })
        .catch((err) => {
          reject(Error(err));
        });
    });
  },
};
