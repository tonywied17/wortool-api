const { authJwt } = require("../middleware");
const wor = require("../controllers/wor.controller");

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
  app.get("/pa/wor/recaps", wor.findAll);

  // Post Routes
  app.post(
    "/pa/wor/server",
    // [authJwt.verifyToken, authJwt.isAdmin],
    wor.storeRecap
  );
};


