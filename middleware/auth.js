const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const collection = require('../connection/collection');

module.exports = (secret) => (req, res, next) => {
  // Obtenemos headers.authorization.
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }
  // Separa tipo de autenticación "Bearer".
  const [type, token] = authorization.split(' ');
  if (type.toLowerCase() !== 'bearer') {
    return next();
  }
  // Decodifica token { uid, secret, exp ...}
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    // Verificar la identidad del usuario decodedToken.uid
    return collection('users')
      .then((collectionUsers) => collectionUsers.findOne({ _id: ObjectId(decodedToken.uid) })
        .then((user) => {
          // Asignamos el usuario autenticado a la cabecera.
          req.headers.user = user;
          return next();
        }));
  });
};

module.exports.isAuthenticated = (req) => (req.headers.user);

module.exports.isAdmin = (req) => (req.headers.user.roles.admin);
