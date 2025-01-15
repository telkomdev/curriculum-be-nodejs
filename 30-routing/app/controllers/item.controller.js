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

  res.send({
    message: 'This route is a placeholder that will save ' 
      + JSON.stringify(req.body) + ' later'
  });
};

exports.findAll = (req, res) => {
  res.send({
    message: 'This route is a placeholder that will get all items later'
  });
};
