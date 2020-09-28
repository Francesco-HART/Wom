const UserModel = require("../models/user");
// is my address middleware for GraphQL
module.exports = (auth_user, address_id) => {
  return new Promise(async (resolve, reject) => {
    if (auth_user.type === "admin") return resolve(auth_user);
    let auth = await UserModel.findById(auth_user.id);
    address = auth.list_address;
    if (!address_id || !address.includes(address_id.toString()))
      return reject(Error("Il ne s'agit pas de votre adresse"));
    resolve(auth_user);
  });
};
