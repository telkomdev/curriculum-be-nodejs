const { authJwt } = require('../middlewares');

module.exports = function (app) {
  const controller = require('../controllers/route.controller.js');
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept'
    );
    next();
  });
  app.post('/api/v1/route/import', [authJwt.verifyToken, authJwt.isAdmin], controller.import);
  app.post('/api/v1/route', [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  //Retrieve all route
  app.get('/api/v1/route', [authJwt.verifyToken], controller.findAll);
  //Retrieve a single ticket with id
  app.get('/api/v1/route/:id', [authJwt.verifyToken], controller.findOne);
  //Update a ticket with id
  app.put('/api/v1/route/:id', [authJwt.verifyToken, authJwt.isAdmin], controller.update);
};
