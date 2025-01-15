const db = require('../models');
const Item = db.item;
const { helper } = require('../helper');

exports.create = (req, res) => {
  if (!req.body.name | !req.body.qty) {
    res.status(400).send({
      message: '"name" and "qty" cannot be empty',
    });
    return;
  }

  const item = new Item({
    name: req.body.name,
    qty: req.body.qty,
  });
  item
    .save(item)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while creating item.',
      });
    });
};

exports.find = (req, res) => {
  const { page, size } = req.query;
  let ret = {};
  const { limit, offset } = helper.getPagination(page - 1, size);
  Item.paginate({}, { offset, limit })
    .then((data) => {
      ret.success = 1;
      ret.count = data.totalDocs;
      ret.totalPages = data.totalPages;
      ret.currentPage = data.page;
      ret.items = data.docs;
      res.send(ret);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving items.',
      });
    });
};
