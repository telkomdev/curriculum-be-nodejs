const { query } = require('express');
const db = require('../models');
const Booking = db.booking;
const { helper } = require('../helper');
const axios = require('axios');

exports.create = async (req, res) => {
  //Validate request
  const token = req.headers['authorization'];
  if (!req.body.routeId || !req.body.quantity || !req.body.scheduleDate) {
    res.status(400).send({
      message: 'Field routeId, quantity and scheduleDate cannot be empty!',
    });
    return;
  }
  let routeApiUrl = process.env.ROUTE_API_URL;
  let userApiUrl = process.env.USER_API_URL;
  let ticketApiUrl = process.env.TICKET_API_URL;

  let tickets = [];
  const route = await axios
    .get(routeApiUrl + req.body.routeId, {
      headers: {
        Authorization: token,
      },
    })
    .catch((err) => {
      res.status(500).send({
        message: `Error when retrieving data route, maybe route with ${req.body.routeId} not found`,
      });
    });
  const user = await axios
    .get(userApiUrl + 'me', {
      headers: {
        Authorization: token,
      },
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error when retrieving user data',
      });
    });
  if (route && user) {
    const booking = new Booking({
      quantity: req.body.quantity,
      departureTime: req.body.scheduleDate + ' ' + route.data.departureTime,
      totalPrice: req.body.quantity * route.data.price,
      user: user.data,
      route: route.data,
      paymentStatus: 0,
    });
    booking.save(booking).catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });

    for (let i = 0; i < req.body.quantity; i++) {
      const ticket = await axios
        .post(
          ticketApiUrl,
          {
            userId: user.data.id,
            bookingId: booking.id,
            from: route.data.from,
            to: route.data.to,
            departureTime: booking.departureTime,
            price: route.data.price,
          },
          {
            headers: {
              Authorization: token,
              'content-type': 'application/json',
            },
          }
        )
        .catch((err) => {
          return res.status(500).send({
            message: err.message,
          });
        });
      tickets.push(ticket.data);
    }
    booking.tickets = tickets;
    booking.save((err) => {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
      res.send(booking);
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Booking.findById(id)
    .then((data) => {
      if (!data)
        return res
          .status(404)
          .send({ message: `Bookings with id ${req.params.id} was not found` });
      else return res.status(200).send(data);
    })
    .catch((err) => {
      return res.status(500).send({
        message: `Error when retrieving bookings with id ${req.params.id}`,
      });
    });
};

exports.findAll = (req, res) => {
  const { page, size } = req.query;
  let condition = {};

  const { limit, offset } = helper.getPagination(page - 1, size);
  Booking.paginate(condition, {
    offset,
    limit,
  })
    .then((data) => {
      let ret = {};
      ret.success = 1;
      ret.count = data.totalDocs;
      ret.totalPages = data.totalPages;
      ret.currentPage = data.page;
      ret.bookings = data.docs;
      return res.status(200).send(ret);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving booking date.',
      });
    });
};

exports.cancelPayment = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Required bookingId to complete booking!',
    });
  }
  Booking.findByIdAndUpdate(req.body.bookingId, {}, { useFindAndModify: false })
    .then((booking) => {
      if (!booking) {
        return res.status(404).send({
          message: `Error updating payment status booking with id ${id}`,
        });
      }
      if (booking.paymentStatus > 0) {
        return res.status(404).send({
          message: `Error, cancel payment only can be done when payment status is 0 (Created)`,
        });
      }
      booking.paymentStatus = 2;
      booking.save((err) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.send(booking);
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });
};

exports.completePayment = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Required bookingId to complete booking!',
    });
  }
  Booking.findByIdAndUpdate(req.body.bookingId, {}, { useFindAndModify: false })
    .then((booking) => {
      if (!booking) {
        return res.status(404).send({
          message: `Error updating payment status booking with id ${id}`,
        });
      }
      if (booking.paymentStatus > 0) {
        return res.status(404).send({
          message: `Error, complete payment only can be done when payment status is 0 (Created)`,
        });
      }
      booking.paymentStatus = 1;
      booking.save((err) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.send(booking);
      });
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });
};

exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!',
    });
  }
  if (req.body.quantity) {
    return res.status(404).send({
      message: `Update only available for status and schedule date`,
    });
  }

  const id = req.params.id;
  Booking.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Error updating booking with id ${id}`,
        });
      }
      if (req.body.orderStatus) {
        Status.findOne(
          {
            name: req.body.orderStatus,
          },
          (err, status) => {
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            data.status = status._id;
            data.save((err) => {
              if (err) {
                return res.status(500).send({ message: err.message });
              }
              return res.send({ message: 'Booking was updated successfully' });
            });
          }
        );
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message,
      });
    });
};
