const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const db = {};
db.mongoose = mongoose;
db.item = require('./item.model')(mongoose, mongoosePaginate);
db.user = require('./user.model')(mongoose, mongoosePaginate);
db.route = require('./route.model')(mongoose, mongoosePaginate);
db.role = require('./role.model');
db.ROLES = ['user', 'admin'];

module.exports = db;
