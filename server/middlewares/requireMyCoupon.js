const passport = require("passport");
const UserModel = require("../models/user");
// is my coupon middleware for GraphQL
module.exports = (auth_user, coupon_id) => {
    return new Promise(async (resolve, reject) => {
        if (auth_user.type === 'admin') return resolve(auth_user)
        const coupon = UserModel.findById(auth_user.id).select('coupon')
        if (coupon.toString() !== coupon_id.toString()) return reject(Error("Il ne s'agit pas de votre coupon"));
        resolve(auth_user);
    });
};
