const mongoose = require('mongoose');
const Role = mongoose.model(
  'Role',
  new mongoose.Schema({
    __v: { type: Number, select: false },
    name: String,
  })
);

module.exports = Role;
