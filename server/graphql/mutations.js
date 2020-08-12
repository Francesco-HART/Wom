const graphql = require("graphql");
const { addUser } = require("./mutations/mutationUser");
const { addAddress } = require("./mutations/mutationAddress");

const { GraphQLObjectType } = graphql;

module.exports = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    addUser,
    addAddress,
  }),
});
