const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

module.exports = (mongoose) => {
  var ticketSchema = new mongoose.Schema(
    {
      from: String,
      to: String,
      departureTime: Date,
      bookingId: String,
      userId: String,
      price: Number,
    },
    { timestamps: true }
  );

  ticketSchema.method('toJSON', function () {
    const { __V, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  ticketSchema.plugin(mongoosePaginate);
  const Ticket = mongoose.model('ticket', ticketSchema);
  return Ticket;
};
