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

  /**
   * ROUTES
   */

  // Get Routes
  app.get(
    "/pa/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByUserAndMap
  );

  app.get(
    "/pa/favorites/user/:userId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByUser
  );

  app.get(
    "/pa/favorites/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByMap
  );

  // Post Routes
  app.post(
    "/pa/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.createOrUpdateFavorite
  );

  // Delete Routes
  app.delete(
    "/pa/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.deleteFavorite
  );
};
