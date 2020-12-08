const graphql = require("graphql");
const { UserType } = require("./user");
const GratuityType = require("./gratuityType");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

exports.AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    image: { type: GraphQLString },
    gratuities: { type: GraphQLList(GratuityType) },
    siret: { type: GraphQLString },
    validation_code: {
      type: GraphQLString,
    },
    //parent_id:
  }),
});
