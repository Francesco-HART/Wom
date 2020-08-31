const graphql = require("graphql");
const { GraphQLObjectType } = graphql;
const { createCoupon } = require("./mutations/mutationCoupon");
module.exports = new GraphQLObjectType({
  name: "Mutations",
  fields: () => ({
    createCoupon,
  }),
});
