const graphql = require("graphql");
const { fetchUsers, fetchUser } = require("./queries/queryUser");
const {
  fetchAddress,
  fetchOneAddress,
  fetchAddressByUser,
} = require("./queries/queryAddress");
const {
  signOut,
  signIn,
  fetchAuthUser,
} = require("./queries/queryAuthentication");

const { GraphQLObjectType } = graphql;

module.exports = new GraphQLObjectType({
  name: "Querys",
  fields: () => ({
    fetchUsers,
    fetchUser,
    fetchAddressByUser,
    fetchAddress,
    fetchOneAddress,

    fetchAuthUser,

    signOut,
    signIn,
  }),
});
