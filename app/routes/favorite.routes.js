const { authJwt } = require("../middleware");
const favoriteController = require("../controllers/favorite.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.get("/pa/favorites/user/:userId/map/:mapId", [authJwt.verifyToken], favoriteController.findFavoritesByUserAndMap);

  app.post("/pa/favorites/user/:userId/map/:mapId", [authJwt.verifyToken], favoriteController.createOrUpdateFavorite);

  app.get("/pa/favorites/user/:userId", [authJwt.verifyToken], favoriteController.findFavoritesByUser);

  app.get("/pa/favorites/map/:mapId", [authJwt.verifyToken], favoriteController.findFavoritesByMap);

  app.delete("/pa/favorites/user/:userId/map/:mapId", [authJwt.verifyToken], favoriteController.deleteFavorite);

};
