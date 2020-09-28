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
const AddressLogsModel = require("../../models/actions/addressLogs");
const AddressModel = require("../../models/address");
const requireAuth = require("../../middlewares/requireAuth");
const requireMyAddress = require("../../middlewares/requireMyAddress");
const requireAdmin = require("../../middlewares/requireAdmin");
const requireAddress = require("../../middlewares/requireAddress");

const GratuityInputType = new GraphQLInputObjectType({
  name: "GratuityInputType",
  fields: () => ({
    remaining_capacity: { type: GraphQLInt },
    capacity: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    available: { type: GraphQLBoolean },
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
      try {
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
      } catch (err) {
        reject(Error(err));
      }
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
      try {
        const auth_user = await requireAuth(context);
        //address can't update validation code
        if (args.validation_code) await requireAdmin(auth_user.type);
        await requireAddress(auth_user.type);
        await requireMyAddress(auth_user, args.id);
        let update = false;
        let count_address_name = 0;
        const address = await AddressModel.findById(args.id);
        if (!address) reject(Error("Adresse non-existante"));
        //verif if name is alredy use
        if (args.name && address.name !== args.name)
          count_address_name = await AddressModel.countDocuments({
            name: args.name,
          });
        if (count_address_name >= 1) reject(Error("Nom deja existant"));

        //update address
        AddressModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
          .then(async (updated_address) => {
            //verif if gratuty capacity is done and update gratuity status to availale = false
            let updated_address_gratuities = await updated_address.gratuities.map(
              (gratuity) => {
                if (gratuity) {
                  if (gratuity.remaining_capacity === 0) {
                    update = true;
                    //la gratuity n'est plus valide
                    gratuity.available = false;
                  }
                  //if in previous update gratuity capacity is update to capacity < remaning_capacity update remaining capacity = capacity
                  if (gratuity.capacity < gratuity.remaining_capacity) {
                    update = true;
                    gratuity.remaining_capacity = gratuity.capacity;
                  }
                }

                return gratuity;
              }
            );
            if (update) {
              AddressModel.findOneAndUpdate(
                { _id: args.id },
                { gratuities: updated_address_gratuities },
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
            if (err.code === 11000)
              return reject(Error("element déjà utilisé"));
            reject(Error(err));
          });
      } catch (err) {
        reject(Error(err));
      }
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
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        AddressModel.findOneAndDelete({ _id: args.id })
          .then((deleted_user) => {
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

exports.resetGratuities = {
  type: AddressType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAddress(auth_user.type);
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
              { gratuities: updated_remaining_capacity },
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
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.updateGratuity = {
  type: AddressType,
  args: {
    id: { type: GraphQLNonNull(GraphQLID) },
    gratuities: { type: GraphQLNonNull(GratuityInputType) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        await requireAuth(context);
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};
