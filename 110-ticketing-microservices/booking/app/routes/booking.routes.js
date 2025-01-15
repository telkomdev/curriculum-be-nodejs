const { authJwt } = require('../middlewares');

module.exports = function (app) {
  const controller = require('../controllers/booking.controller.js');
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type,Accept'
    );
    next();
  });

  app.post('/api/v1/booking', [authJwt.verifyToken], controller.create);
  app.get(
    '/api/v1/booking',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );
  app.get('/api/v1/booking/:id', [authJwt.verifyToken], controller.findOne);

  app.post(
    '/api/v1/booking/complete',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.completePayment
  );
  app.post(
    '/api/v1/booking/cancel',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.cancelPayment
  );
};
