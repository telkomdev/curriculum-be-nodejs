const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose) => {
  var schema = new mongoose.Schema(
    {
      name: String,
      qty: Number,
    },
    { timestamps: true }
  );
  schema.plugin(mongoosePaginate);
  const Item = mongoose.model('item', schema);
  return Item;
};
