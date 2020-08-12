const graphql = require("graphql");
const { AddressType } = require("../schemas/address");
const AddressModel = require("../../models/address");
const { GraphQLID } = graphql;

exports.fetchAddress = {
  type: AddressType,
  resolve(parent, args) {
    return AddressModel.find();
  },
};

exports.fechOneAddress = {
  type: AddressType,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return AddressModel.findById(args.id);
  },
};
