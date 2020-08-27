const graphql = require('graphql')
const {CouponType} = require('../schemas/coupon')
const {GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList} = graphql
const CouponModel = require('../../models/coupon')
const requireMyCoupon = require('../../middlewares/requireMyCoupon')


exports.deleteCoupon = {
    type: CouponType,
    args: {
        id: {type: GraphQLNonNull(GraphQLString)}
    },

    resolve: (parent, args, context) => {
        return new Promise(async (resolve, reject) => {
            const auth_user = await requireAuth(context);
            await requireAdmin(auth_user.type);
            await requireMyCoupon(auth_user, args.id)
            CouponModel.findOneAndDelete({_id: args.id})
                .then((deleted_user) => {
                    resolve(deleted_user);
                })
                .catch((err) => {
                    reject(Error(err));
                });
        });
    }
}