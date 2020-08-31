const graphql = require("graphql");
const { UserType } = require("./user");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
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
exports.GratuityType;

exports.AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    address: { type: GraphQLString },
    image: { type: GraphQLString },
    gratuities: { type: new GraphQLList(GratuityType) },
    validation_code: {
      type: GraphQLString,
    },
    //parent_id:
  }),
});
