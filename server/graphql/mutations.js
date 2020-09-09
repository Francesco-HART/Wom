const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const { createCoupon } = require("./mutations/mutationCoupon");
const {
  updateAccountPwd,
  signUp,
  updateAccount,
} = require("./mutations/mutationAccount");
const { createAddress } = require("./mutations/mutationAddress");
const {
  createUser,
  updateUser,
  updateUserPwd,
  deleteUser,
} = require("./mutations/mutationUser");
module.exports = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    new_user: createUser,
    //signUp,
    updateUserPwd,
    updateUser,
    updateAccount,
    updateAccountPwd,
    deleteUser,

    createAddress,
  }),
});
