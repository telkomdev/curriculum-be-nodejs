const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.item = require('./item.model')(mongoose);

module.exports = db;
