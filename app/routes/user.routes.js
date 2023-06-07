const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
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

  app.get("/pa/vet/all", controller.allAccess);

  // app.get(
  //   "/pa/vet/user",
  //   [authJwt.verifyToken],
  //   controller.userBoard
  // );

  // app.get(
  //   "/pa/vet/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/pa/vet/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );

  app.get("/pa/vet/user/:userId", [authJwt.verifyToken], controller.userBoard);

  app.get("/pa/vet/mod/:userId", [authJwt.verifyToken, authJwt.isModerator], controller.moderatorBoard);
  
  app.get("/pa/vet/admin/:userId", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

  
};
