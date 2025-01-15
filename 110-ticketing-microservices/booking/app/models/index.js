const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.booking = require('./booking.model')(mongoose, mongoosePaginate);

module.exports = db;
