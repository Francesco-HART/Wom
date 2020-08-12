// admin middleware for GraphQL
module.exports = (type) => {
    return new Promise((resolve, reject) => {
        if (type === 'user') return reject(Error("Vous n'êtes pas une adresse"));
        resolve(type);
    });
};
