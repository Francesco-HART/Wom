const graphql = require("graphql");
const { CouponType } = require("../schemas/coupon");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } = graphql;
const CouponModel = require("../../models/coupon");
const UserModel = require("../../models/user");
const AddessModel = require("../../models/address");

const requireMyCoupon = require("../../middlewares/requireMyCoupon");
const requireAdmin = require("../../middlewares/requireAdmin");
const requireAuth = require("../../middlewares/requireAuth");

exports.createCoupon = {
  type: CouponType,
  args: {
    user: { type: GraphQLNonNull(GraphQLID) },
    address: { type: GraphQLNonNull(GraphQLID) },
    gratuity: { type: GraphQLNonNull(GraphQLString) },
    contribution: { type: GraphQLNonNull(GraphQLString) },
    code_validation: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        // save new user
        //TODO verif if gratuity is dispo
        //TODO verif if code validation is good
        AddessModel.findById(args.address_id)
          .then((address) => {
            address.compareValidationCode(args.validation_code, function (
              err,
              isMatch
            ) {
              if (err) return reject(err);
              if (!isMatch) return reject("mot de passe invalide");
              let returned_address = Object.assign({}, address);
              returned_address = returned_address._doc;
              delete returned_address.validation_code;
            });
            UserModel.findById(args.user_id)
              .populate("coupon")
              .then((user) => {
                if (user.coupon && user.coupon.date_end > Date.now())
                  reject(Error("coupon deja en court"));
                new CouponModel(args)
                  .save()
                  .then(async (created_coupon) => {
                    try {
                      console.log("in mutation create coupon", created_coupon);
                      const user_updated = await UserModel.findOneAndUpdate(
                        { _id: args.user },
                        { coupon: created_coupon._id },
                        { new: true }
                      );
                      resolve(created_coupon);
                    } catch (err) {
                      reject(Error(err));
                    }
                  })
                  .catch((err) => {
                    if (err.code === 11000)
                      return reject(Error("Login déjà utilisé"));
                    reject(Error(err));
                  });
              })
              .catch((err) => {
                reject(Error(err));
              });
          })
          .select("+password");
      } catch (err) {
        reject(Error(err));
      }
    });
  },
};

exports.updateCoupon = {
  type: CouponType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
    status: { type: GraphQLString },
  },
  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        requireAdmin(auth_user.type);
        CouponModel.findOneAndUpdate({ _id: args.id }, args, { new: true })
          .then((updated_coupon) => {
            resolve(updated_coupon);
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

exports.deleteCoupon = {
  type: CouponType,
  args: {
    id: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: (parent, args, context) => {
    return new Promise(async (resolve, reject) => {
      try {
        const auth_user = await requireAuth(context);
        await requireAdmin(auth_user.type);
        await requireMyCoupon(auth_user, args.id);
        CouponModel.findOneAndDelete({ _id: args.id })
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
