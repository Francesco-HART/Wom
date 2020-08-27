const graphql = require('graphql')
const {UserType} = require('../schemas/user')
const {Type} = require('../schemas/user')
const {GraphQLID, GraphQLNonNull, GraphQLString, GraphQLObjectType} = graphql
const UserModel = require('../../models/user')
const UserLogsModel = require('../../models/actions/userLogs')


exports.deleteUser = {
    type: UserType,
    args: {
        id: {type: GraphQLNonNull(GraphQLString)}
    },

    resolve: (parent, args, context) => {
        return new Promise(async (resolve, reject) => {
            const auth_user = await requireAuth(context);
            await requireAdmin(auth_user.type);

            UserModel.findOneAndDelete({_id: args.id})
                .then((deleted_user) => {
                    new UserLogsModel({
                        type: "delete_user",
                        user: auth_user.id,
                        target: {login: deleted_user.login},
                    }).save();
                    resolve(deleted_user);
                })
                .catch((err) => {
                    reject(Error(err));
                });
        });
    }
}
