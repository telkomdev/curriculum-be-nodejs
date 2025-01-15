module.exports = function (app) {
  const controller = require('../controllers/item.controller');

  //Create new item
  app.post(
    '/api/v1/item',
    controller.create
  );

  //Get all items
  app.get(
    '/api/v1/item',
    controller.find
  );
};
