const UserModel = require("../models/user");
// is my address middleware for GraphQL
module.exports = (auth_user, address_id) => {
    return new Promise(async (resolve, reject) => {
        if (auth_user.type === 'admin') return resolve(auth_user);
        let address = await UserModel.findById(auth_user.id).select('address')
        address = auth_user.address.map(address => address.toString())
        if (!address.length && !address.includes(address_id.toString())) return reject(Error("Il ne s'agit pas de votre adresse"));
        resolve(auth_user);
    });
};
