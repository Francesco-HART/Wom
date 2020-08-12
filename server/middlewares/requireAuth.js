const passport = require("passport");

// login middleware for GraphQL
module.exports = (context) => {
    return new Promise((resolve, reject) => {
        passport.authenticate("jwt", {session: false}, (err, user) => {
            if (!user) return reject(Error("JWT invalide"));
            resolve(user);
        })(context);
    });
};