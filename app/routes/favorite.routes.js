/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\favorite.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:47:25 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const favoriteController = require("../controllers/favorite.controller");

/**
 * Favorite Routes
 * @param {*} app 
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  // ! Get Routes //

  /**
   * Get All Favorites By User and Map
   * @route GET /v2/favorites/user/:userId/map/:mapId
   * @group Favorites
   * @returns {object} 200 - An object containing the favorites
   */
  app.get(
    "/v2/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByUserAndMap
  );

  /**
   * Get All Favorites By User
   * @route GET /v2/favorites/user/:userId
   * @group Favorites
   * @returns {object} 200 - An object containing the favorites
   */
  app.get(
    "/v2/favorites/user/:userId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByUser
  );

  /**
   * Get All Favorites By Map
   * @route GET /v2/favorites/map/:mapId
   * @group Favorites
   * @returns {object} 200 - An object containing the favorites
   */
  app.get(
    "/v2/favorites/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.findFavoritesByMap
  );

  // ! Post Routes //

  /**
   * Create or Update Favorite
   * @route POST /v2/favorites/user/:userId/map/:mapId
   * @group Favorites
   * @returns {object} 200 - An object containing the favorites
   */
  app.post(
    "/v2/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.createOrUpdateFavorite
  );

  // ! Delete Routes //

  /**
   * Delete Favorite
   * @route DELETE /v2/favorites/user/:userId/map/:mapId
   * @group Favorites
   * @returns {object} 200 - An object containing the favorites
   */
  app.delete(
    "/v2/favorites/user/:userId/map/:mapId",
    [authJwt.verifyToken],
    favoriteController.deleteFavorite
  );
};
