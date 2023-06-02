const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
var router = require("express").Router();

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/pa/test/all", controller.allAccess);

  app.get(
    "/pa/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/pa/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/pa/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );


};