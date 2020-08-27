const graphql = require('graphql')
const {AddressType} = require('../schemas/address')
const {GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList} = graphql
const AddressModel = require('../../models/address')
const requireMyAddress = require('../../middlewares/requireMyAddress')



exports.deleteAddress = {
    type: AddressType,
    args: {
        id: {type: GraphQLNonNull(GraphQLString)}
    },

    resolve: (parent, args, context) => {
        return new Promise(async (resolve, reject) => {
            const auth_user = await requireAuth(context);
            await requireAdmin(auth_user.type);
            await requireMyAddress(auth_user, args.id)
            AddressModel.findOneAndDelete({_id: args.id})
                .then((deleted_user) => {
                    resolve(deleted_user);
                })
                .catch((err) => {
                    reject(Error(err));
                });
        });
    }
}

