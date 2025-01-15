const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose) => {
  var userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    _id: { type: String, select: false },
  });
  var ticketSchema = new mongoose.Schema({
    id: String,
    from: String,
    to: String,
    departureTime: String,
    bookingId: String,
    userId: String,
    createdAt: Date,
    updatedAt: Date,
    price: Number,
    _id: { type: String, select: false },
  });
  var bookingSchema = new mongoose.Schema(
    {
      user: userSchema,
      tickets: [ticketSchema],
      quantity: Number,
      totalPrice: Number,
      paymentStatus: Number,
      departureTime: Date,
    },
    { timestamps: true }
  );

  bookingSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  bookingSchema.plugin(mongoosePaginate);
  const Booking = mongoose.model('booking', bookingSchema);
  return Booking;
};
