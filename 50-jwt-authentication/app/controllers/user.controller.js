const db = require('../models');
const User = db.user;
const Role = db.role;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const config = require('../config/auth.config');

const maxAge = 60 * 60 * 24; //Token maximum age 24 hours

exports.createAdmin = (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).send({
      message: 'To create user required email, name and password!',
    });
  }
  const { email, password, name } = req.body;
  if (password.length < 6) {
    return res.status(400).send({
      message: 'Password min length 6 characters',
    });
  }
  const user = new User({
    email: email,
    password: bcrypt.hashSync(password, 8),
    name: name,
  });
  user.save((err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    Role.findOne({ name: 'admin' }, (err, role) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      user.roles = [role._id];
      user.save((err) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(201).send({ message: 'User was registered successfully!' });
      });
    });
  });
};

exports.create = (req, res) => {
  if (!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).send({
      message: 'To create user required email, name and password!',
    });
  }
  const { email, password, name } = req.body;
  if (password.length < 6) {
    return res.status(400).send({
      message: 'Password min length 6 characters',
    });
  }
  const user = new User({
    email: email,
    password: bcrypt.hashSync(password, 8),
    name: name,
  });
  user.save((err, user) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            res
              .status(201)
              .send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          }
          res
            .status(201)
            .send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: 'Invalid email or password!',
    });
  }
  const { email, password } = req.body;
  User.findOne({
    email: email,
  })
    .select('+password')
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return res.status(400).send({ message: err.message });
      }
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found!',
        });
      }

      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(404).send({
          message: 'User Not Found!',
        });
      }
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(400).send({
          message: 'Invalid email or password!',
        });
      }
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toLowerCase());
      }
      var token = jwt.sign({ id: user.id, roles: authorities }, config.secret, {
        expiresIn: maxAge,
      });
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};

exports.getMe = (req, res) => {
  User.findOne({
    _id: req.userId,
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push(user.roles[i].name.toLowerCase());
      }
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        roles: authorities,
      });
    });
};

exports.findAll = (req, res) => {
  const { name } = req.query;
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  User.find(condition)
    .populate('roles', '-__v')
    .then((data) => {
      let ret = {};
      ret.success = 1;
      ret.count = data.length;
      ret.users = data;
      res.send(ret);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving users data.',
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .populate('roles', '-__v')
    .then((data) => {
      if (!data)
        res.status(404).send({
          message: 'Cannot find user with id ' + id,
        });
      else res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message: `Error retrieving Users with id=${id}, maybe user was not found`,
      });
    });
};

exports.updateById = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!',
    });
  }
  const id = req.params.id;
  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot update User with id=${id}. May user was not found`,
        });
      } else res.send({ message: 'User was updated successfully.' });
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Error updating user with id=' + id,
      });
    });
};

exports.updateMe = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!',
    });
  }

  const id = req.userId;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot update User with id=${id}. May user was not found`,
        });
      } else res.send({ message: 'User was updated successfully.' });
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Error updating user with id=' + id,
      });
    });
};

exports.deleteById = (req, res) => {
  const id = req.params.id;
  User.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot delete user with id=${id}. Maybe user was not found`,
        });
      } else {
        res.send({
          message: `User with id ${id} was deleted successfully!`,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Could not delete user with id=' + id,
      });
    });
};
