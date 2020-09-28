const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const { createCoupon } = require("./mutations/mutationCoupon");
const {
  updateAccountPwd,
  signUp,
  updateAccount,
} = require("./mutations/mutationAccount");
const {
  createAddress,
  updateAddress,
  deleteAddress,
  resetGratuities,
} = require("./mutations/mutationAddress");
const {
  createUser,
  updateUser,
  updateUserPwd,
  deleteUser,
} = require("./mutations/mutationUser");

const { addUserAddress } = require("./mutations/mutationUserAddress");
module.exports = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    new_user: createUser,
    //signUp,
    updateUserPwd,
    updateUser,
    deleteUser,

    updateAccount,
    updateAccountPwd,

    createAddress,
    updateAddress,
    deleteAddress,
    resetGratuities,

    addUserAddress,
  }),
});
