const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  // CORS
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
  app.get("/pa/vet/all", controller.allAccess);

  // Post Routes
  app.post("/pa/vet/user/", [authJwt.verifyToken], controller.userBoard);
  app.post(
    "/pa/vet/mod/",
    [authJwt.isModerator],
    controller.moderatorBoard
  )
  app.post(
    "/pa/vet/admin/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // Delete Routes
  
};
