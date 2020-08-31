const graphql = require("graphql");
const graphqDate = require("graphql-iso-date");
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
const { CouponType } = require("./coupon");
const { AddressType } = require("./address");
const { UserType } = require("./user");

const Status = new GraphQLEnumType({
  name: "Status",
  values: {
    toDo: {
      value: "toDo",
    },
    inProgress: {
      value: "inProgress",
    },
    valid: {
      value: "valid",
    },
    neverValid: {
      value: "neverValid",
    },
    refuse: {
      value: "refuse",
    },
  },
});
exports.CouponType = new GraphQLObjectType({
  name: "Coupon",
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
    status: { type: Status },
    gratuity: { type: GraphQLString },
    contribution: { type: GraphQLString },
    date_start: { type: GraphQLDateTime },
    date_end: { type: GraphQLDateTime },
  }),
});
