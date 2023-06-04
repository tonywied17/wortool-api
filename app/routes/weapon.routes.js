const { authJwt } = require("../middleware");
const weapon = require("../controllers/weapon.controller");

var router = require("express").Router();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/pa/weapons/",
    weapon.findAll
  );

  app.get(
    "/pa/weapons/:id",
    weapon.findOne
  );

  app.post(
    "/pa/weapons/",
    [authJwt.verifyToken, authJwt.isAdmin],
    weapon.createWeapon
  );

};
