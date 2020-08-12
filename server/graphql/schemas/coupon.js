const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLList,
} = graphql;
const { GraphQLDateTime } = graphqDate;
const CouponModel = require("../../models/coupon");
const { AddressType } = require("./address");
const { UserType } = require("./user");

exports.CouponType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return CouponModel.findById(parent.id)
          .populate("user")
          .then((coupon) => coupon.user);
      },
    },
    address: {
      type: AddressType,
      resolve(parent, args) {
        return CouponModel.findById(parent.id)
          .populate("address")
          .then((coupon) => coupon.address);
      },
    },
    gratuity: { type: GraphQLString },
    contribution: { type: GraphQLString },
    start: { type: GraphQLDateTime },
    end: { type: GraphQLDateTime },
  }),
});
