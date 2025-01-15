const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }
  token = token.replace(/^Bearer\s+/, '');
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    req.roles = decoded.roles;
    next();
  });
};

isAdmin = (req, res, next) => {
  let roles = req.roles;
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] === 'admin') {
      next();
      return;
    }
  }
  res.status(403).send({ message: 'Require Admin Role!' });
  return;
};
const authJwt = {
  verifyToken,
  isAdmin,
};
module.exports = authJwt;
