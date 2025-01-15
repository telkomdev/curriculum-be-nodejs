const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose) => {
  var routeSchema = new mongoose.Schema(
    {
      from: String,
      to: String,
      price: Number,
      departureTime: String,
    },
    { timestamps: true }
  );
  routeSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  routeSchema.index({ from: 'text', to: 'text' });
  routeSchema.plugin(mongoosePaginate);
  const Route = mongoose.model('route', routeSchema);
  Route.createIndexes();
  return Route;
};
