const graphql = require("graphql");
const { fetchUsers, fetchUser } = require("./queries/queryUser");
const { fetchAddress, fechOneAddress } = require("./queries/queryAddress");
const {
  signUp,
  signOut,
  signIn,
  fetchAuthUser,
} = require("./queries/queryAuthentication");
console.log(signOut);

const { GraphQLObjectType } = graphql;

module.exports = new GraphQLObjectType({
  name: "Querys",
  fields: () => ({
    fetchUsers,
    fetchUser,

    fetchAddress,
    fechOneAddress,

    fetchAuthUser,
    signUp,
    signOut,
    signIn,
  }),
});
