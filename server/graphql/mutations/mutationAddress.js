const graphql = require("graphql");
const { AddressType } = require("../schemas/address");

const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;
const UserModel = require("../../models/user");
const AddressModel = require("../../models/address");
const requireAuth = require("../../middlewares/requireAuth");
const requireMyAddress = require("../../middlewares/requireMyAddress");
const requireAdmin = require("../../middlewares/requireAdmin");

const GratuityInputType = new GraphQLInputObjectType({
  name: "GratuityInputType",
  fields: () => ({
    remaining_capacity: { type: GraphQLInt },
    capacity: { type: GraphQLInt },
    name: { type: GraphQLNonNull(GraphQLString) },
    image: { type: GraphQLString },
  }),
});

exports.createAddress = {
  type: AddressType,
  args: {
    name: { type: GraphQLNonNull(GraphQLString) },
    address: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    gratuities: { type: GraphQLNonNull(GraphQLList(GratuityInputType)) },
    image: { type: GraphQLString },
    phone_number: { type: GraphQLNonNull(GraphQLString) },
    validation_code: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      // save new user
      //asign to user
      const auth_user = await requireAuth(context);
      await requireAdmin(auth_user.type);
      new AddressModel(args)
        .save()
        .then(async (created_address) => {
          resolve(created_address);
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
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    gratuities: { type: GraphQLList(GratuityInputType) },
    image: { type: GraphQLString },
    email: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    validation_code: { type: GraphQLString },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      const address = await AddressModel.countDocuments({ name: args.name });
      if (address > 1) reject("Nom deja existant");
      let update = false;
      if (args.validation_code) await requireAdmin(auth_user.type);
      await requireMyAddress(auth_user.type);
      //update address
      AddressModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
        .then((updated_address) => {
          //verif if gratuuiy capacity is done and update gratuity status to availale = false
          updated_address_gratuities = updated_address.gratuites.map(
            (gratuity) => {
              if (gratuity) {
                if (gratuity.remaining_capacity === 0) {
                  update = true;
                  gratuity.available = false;
                }
                //if in previous update gratuity capacity is update to capacity < remaning_capacity update remaining capacity = capacity
                if (gratuity.capacity < gratuity.remaining_capacity)
                  gratuity.remaining_capacity = gratuity.capacity;
              }
              return gratuity;
            }
          );
          console.log(gratuity);
          if (update) {
            AddressModel.findOneAndUpdate(
              { _id: args.id },
              { gatuities: updated_address_gratuities },
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
    id: { type: GraphQLNonNull(GraphQLID) },
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
    id: { type: GraphQLNonNull(GraphQLID) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      const auth_user = await requireAuth(context);
      await requireMyAddress(auth_user, args.id);
      AddressModel.findById(args.id)
        .then((address) => {
          const updated_remaining_capacity = address.gratuities.map(
            (gratuity) => {
              gratuity.remaining_capacity = gratuity.capacity;
              gratuity.available = true;
              return gratuity;
            }
          );
          AddressModel.findOneAndUpdate(
            { _id: args.id },
            { gatuities: updated_remaining_capacity },
            { new: true }
          )
            .then((updated_address) => {
              resolve(updated_address);
            })
            .catch((err) => {
              reject(Error(err));
            });
        })
        .catch((err) => {
          reject(Error(err));
        });
    });
  },
};
