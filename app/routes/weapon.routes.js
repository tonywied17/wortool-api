
const weapon = require("../controllers/weapon.controller");

module.exports = function (app) {
  const { authJwt } = require("../middleware");
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.delete("/pa/weapons/weapon/:weaponId", [authJwt.verifyToken, authJwt.isAdmin], weapon.deleteWeapon);

  app.post("/pa/weapons/weapon/:weaponId", [authJwt.verifyToken, authJwt.isAdmin], weapon.createOrUpdateWeapon);


  app.get(
    "/pa/weapons/",
    weapon.findAll
  );

  app.get(
    "/pa/weapons/:id",
    weapon.findOne
  );

}