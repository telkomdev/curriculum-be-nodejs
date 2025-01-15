const { query } = require('express');
const db = require('../models');
const Ticket = db.ticket;
const { helper } = require('../helper');

//Create and save a new Ticket
exports.create = (req, res) => {
  //Validate request
  if (
    !req.body.from ||
    !req.body.to ||
    !req.body.bookingId ||
    !req.body.userId ||
    !req.body.departureTime ||
    !req.body.price
  ) {
    res.status(400).send({
      message:
        'Field from, to, userId, bookingId, departureTime cannot be empty',
    });
    return;
  }
  const ticket = new Ticket({
    from: req.body.from,
    to: req.body.to,
    bookingId: req.body.bookingId,
    userId: req.body.userId,
    departureTime: req.body.departureTime,
    price: req.body.price,
  });
  ticket
    .save(ticket)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the ticket.',
      });
    });
};

//Retrieve all Tickets from database
exports.findAll = (req, res) => {
  const { page, size, search, status, from, to } = req.query;
  let condition = {};
  if (req.query.search) {
    condition.search = { $text: { $search: search } };
  }
  if (req.query.status) {
    condition.status = { $regex: new RegExp(status), $options: 'i' };
  }
  if (req.query.from) {
    condition.from = { $regex: new RegExp(from), $options: 'i' };
  }
  if (req.query.to) {
    condition.to = { $regex: new RegExp(to), $options: 'i' };
  }
  const { limit, offset } = helper.getPagination(page - 1, size);

  Ticket.paginate(condition, { offset, limit })
    .then((data) => {
      let ret = {};
      ret.success = 1;
      ret.count = data.totalDocs;
      ret.totalPages = data.totalPages;
      ret.currentPage = data.page;
      tickets = data.docs;
      res.send(ret);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || 'Some error occurred while retrieving tickets.',
      });
    });
};

//Find single ticket by id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Ticket.findById(id)
    .then((data) => {
      if (!data)
        return res
          .status(404)
          .send({ message: 'Not found ticket with id ' + id });
      else res.send(data);
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: 'Error retrieving ticket with id =' + id });
    });
};

//Update a ticket by the id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update cannot be empty!',
    });
  }
  const id = req.params.id;
  Ticket.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Cannot update ticket with id=${id}. Maybe ticket was not found!`,
        });
      } else return res.send({ message: 'Ticket was updated successfully.' });
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Error updating ticket with id=' + id,
      });
    });
};

//Delete ticket by id
exports.deleteById = (req, res) => {
  const id = req.params.id;
  Ticket.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        return res.status(200).send({
          message: `Ticket with id ${id} was deleted successfully!`,
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: 'Could not delete ticket with id=' + id,
      });
    });
};
