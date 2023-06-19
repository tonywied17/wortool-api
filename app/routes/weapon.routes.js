const { authJwt } = require("../middleware");
const weapon = require("../controllers/weapon.controller");

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
  app.get("/pa/weapons/", weapon.findAll);
  app.get("/pa/weapons/:id", weapon.findOne);

  // Post Routes
  app.post(
    "/pa/weapons/weapon/:weaponId",
    [authJwt.verifyToken, authJwt.isAdmin],
    weapon.createOrUpdateWeapon
  );

  // Delete Routes
  app.delete(
    "/pa/weapons/weapon/:weaponId",
    [authJwt.verifyToken, authJwt.isAdmin],
    weapon.deleteWeapon
  );
};
