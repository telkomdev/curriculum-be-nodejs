const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;

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
    next();
  });
};

verifySuperAdminSecret = (req, res, next) => {
  let secretKey = req.headers['secret-key'];
  if (!secretKey) {
    return res.status(403).send({ message: 'No secret-key provided!' });
  }
  if (secretKey !== config.secretKey) {
    return res.status(401).send({ message: 'secret-key unauthorized' });
  }
  next();
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    if (!user) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err.message });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }
        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  verifySuperAdminSecret,
  isAdmin,
};
module.exports = authJwt;
