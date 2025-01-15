const mongoose = require('mongoose');
const { isEmail } = require('validator');

module.exports = (mongoose) => {
  var schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Please enter user name'],
      },
      email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email'],
      },
      password: {
        type: String,
        select: false,
        required: [true, 'Please enter a password'],
      },
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
    },
    { timestamps: true }
  );
  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const User = mongoose.model('user', schema);
  return User;
};
