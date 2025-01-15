const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.item = require('./item.model')(mongoose);
db.user = require('./user.model')(mongoose);
db.route = require('./route.model')(mongoose);
db.role = require('./role.model');
db.ROLES = ['user', 'admin'];

module.exports = db;
