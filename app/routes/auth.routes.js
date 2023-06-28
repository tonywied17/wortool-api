const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * ROUTES
   */

  // Get Routes

  // Post Routes
  app.post("/pa/auth/signin", controller.signin);

  app.post(
    "/pa/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.put(
    "/pa/auth/:userId/updatePassword",
    [authJwt.verifyToken],
    controller.password
  );

  app.put(
    "/pa/auth/:userId/updateProfile",
    [authJwt.verifyToken],
    controller.profile
  );

  app.put(
    "/pa/auth/:userId/setModerator",
    controller.setModerator
  );

  app.put(
    "/pa/auth/:userId/removeModerator",
    controller.removeModerator
  );

  // Delete Routes
};
