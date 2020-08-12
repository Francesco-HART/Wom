const graphql = require("graphql");
const {GraphQLID, GraphQLList} = graphql;
const {CouponType} = require("../schemas/coupon");
const CouponModel = require('../../models/coupon')
const requireAuth = require('../../middlewares/requireAuth')
const requireAdmin = require('../../middlewares/requireAdmin')
const requireMyCoupon = require('../../middlewares/requireMyCoupon')

exports.fetchCoupons = {
    type: GraphQLList(CouponType),
    resolve: async (parent, args, context) => {
        const auth_user = await requireAuth(context)
        await requireAdmin(auth_user.type)
        return CouponModel.find();
    },
};

exports.fetchCoupon = {
    type: CouponType,
    args: {id: {type: GraphQLID}},
    resolve: async (parent, args, context) => {
        const auth_user = await requireAuth(context)
        await requireMyCoupon(auth_user, args.id)
        return CouponModel.findById(args.id);
    },
};
