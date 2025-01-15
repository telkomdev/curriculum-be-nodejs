const { authJwt } = require('../middlewares');

module.exports = function (app) {
  const controller = require('../controllers/ticket.controller.js');
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type,Accept'
    );
    next();
  });
  //Create a new ticket
  app.post('/api/v1/ticket', [authJwt.verifyToken], controller.create);
  //Retrieve all tickets
  app.get('/api/v1/ticket', [authJwt.verifyToken], controller.findAll);
  //Retrieve a single ticket with id
  app.get('/api/v1/ticket/:id', [authJwt.verifyToken], controller.findOne);
};
