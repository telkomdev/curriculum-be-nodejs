const { authJwt, verifySignUp } = require('../middlewares');
const controller = require('../controllers/user.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'Authorization, Origin, Content-Type, Accept'
    );
    next();
  });
  app.post(
    '/api/v1/user/create/admin',
    [authJwt.verifySuperAdminSecret],
    controller.createAdmin
  );
  app.post(
    '/api/v1/user/create',
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkDuplicateEmail],
    controller.create
  );
  app.post('/api/v1/user/auth', controller.login);
  app.get('/api/v1/user/me', [authJwt.verifyToken], controller.getMe);
  app.get(
    '/api/v1/user',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAll
  );
  app.get(
    '/api/v1/user/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findOne
  );
  app.put(
    '/api/v1/user/:id',
    [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkRolesExisted],
    controller.updateById
  );
  app.put(
    '/api/v1/user',
    [authJwt.verifyToken, verifySignUp.checkRolesExisted],
    controller.updateMe
  );
  app.delete(
    '/api/v1/user/:id',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteById
  );
};
