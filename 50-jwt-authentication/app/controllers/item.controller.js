const db = require('../models');
const Item = db.item;

exports.create = (req, res) => {
  if (
    !req.body.name |
    !req.body.qty
  ) {
    res.status(400).send({
      message: '"name" and "qty" cannot be empty',
    });
    return;
  }

  const item = new Item({
    name: req.body.name,
    qty: req.body.qty
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
  var ret = {};
  Item.find({})
    .then((data) => {
      ret.success = 1;
      ret.count = data.length;
      ret.data = data;
      res.send(ret)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error occurred while retrieving items.',
      });
    });
};
