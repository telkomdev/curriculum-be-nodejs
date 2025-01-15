const mongoose = require('mongoose');

module.exports = (mongoose) => {
  var schema = new mongoose.Schema(
    {
      name: String,
      qty: Number
    },
    { timestamps: true }
  );
  const Item = mongoose.model('item', schema);
  return Item;
};
