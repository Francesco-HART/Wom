const graphql = require("graphql");
const { UserType } = require("./user");
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

exports.AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    gratuity: { type: new GraphQLList(GraphQLString) },
    validation_code: {
      type: GraphQLString,
    },
    //parent_id:
  }),
});
