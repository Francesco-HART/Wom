// admin middleware for GraphQL
module.exports = (type) => {
    return new Promise((resolve, reject) => {
        if (type != 'admin') return reject("Vous n'êtes pas administrateur");
        resolve(user);
    });
};

