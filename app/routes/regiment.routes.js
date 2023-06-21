const { authJwt } = require("../middleware");
const regimentController = require("../controllers/regiment.controller");

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

  app.get(
    "/pa/regiments/",
    regimentController.findAll
  );

  // Get Routes

  app.get(
    "/pa/regiments/:regimentId",
    regimentController.findOne
  );

  app.get(
    "/pa/regiments/:regimentId/users",
    regimentController.findUsersByRegimentId
  );

  // Post Routes
  app.put(
    "/pa/regiments/:regimentId/update",
    regimentController.update
  );
  // Delete Routes
};
