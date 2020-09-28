const graphql = require("graphql");
const { fetchUsers, fetchUser } = require("./queries/queryUser");
const { fetchAddress, fetchOneAddress } = require("./queries/queryAddress");
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

    fetchAddress,
    fetchOneAddress,

    fetchAuthUser,

    signOut,
    signIn,
  }),
});
