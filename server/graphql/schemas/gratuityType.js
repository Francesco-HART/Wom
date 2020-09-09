const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;

const GratuityType = new GraphQLObjectType({
  name: "Gratuity",
  fields: () => ({
    available: { type: GraphQLBoolean },
    remaining_capacity: { type: GraphQLInt },
    capacity: { type: GraphQLInt },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
  }),
});
module.exports = GratuityType;
