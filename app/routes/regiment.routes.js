/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\regiment.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:34:45 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const regimentController = require("../controllers/regiment.controller");

/**
 * Regiment Routes
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


  // ! GET Routes //

  /**
   * Get All Regiments
   * @route GET /pa/regiments/
   * @group Regiments
   * @returns {object} 200 - An object containing the regiments
   */
  app.get(
    "/pa/regiments/",
    regimentController.findAll
  );


  /**
   * Get Regiment By ID
   * @route GET /pa/regiments/:regimentId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/pa/regiments/:regimentId",
    regimentController.findOne
  );

  /**
   * Get Users of Regiment By Regiment ID
   * @route GET /pa/regiments/:regimentId/users
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users
   */
  app.get(
    "/pa/regiments/:regimentId/users",
    regimentController.findUsersByRegimentId
  );

  /**
   * Get Game IDs of Regiment User's By Regiment ID
   * @route GET /pa/regiments/:regimentId/gameids
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/pa/regiments/:regimentId/gameids",
    regimentController.findGameIdsByRegimentId
  );

  /**
   * Get the Regiment of a User By Steam ID
   * @route GET /pa/regiments/gameid/:steamId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/pa/regiments/gameid/:steamId",
    regimentController.findRegimentBySteamId
  );

  /**
   * Get Steam Data for Regiment User by Game ID (not Steam ID)
   * @route GET /pa/regiments/:regimentId/gameids/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/pa/regiments/:regimentId/gameids/:gameId",
    regimentController.findGameIdsByGameId
  );

  // ! Post Routes //

  /**
   * Update Regiment
   * @route POST /pa/regiments/:regimentId/update
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/pa/regiments/:regimentId/update",
    [authJwt.verifyRegiment],
    regimentController.update
  );

  /**
   * Update Regiment from Public Routes (Used for Guild Icon and Name Changes)
   * @route POST /pa/regiments/:regimentId/change
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/pa/regiments/:regimentId/change",
    [authJwt.verifyDomainAndPath],
    regimentController.update
  )

  /**
   * Create Regiment
   * @route POST /pa/regiments/create
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/pa/regiments/create",
    regimentController.createRegiment
  )

  /**
   * Add User Game ID to Regiment
   * @route POST /pa/regiments/:regimentId/gameid
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/pa/regiments/:regimentId/gameid",
    // [authJwt.verifyRegiment],
    regimentController.addGameId
  )

  // ! Delete Routes //

  /**
   * Delete Regiment
   * @route DELETE /pa/regiments/:regimentId/delete
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/pa/regiments/:userId/remove",
    [authJwt.verifyRegiment],
    regimentController.removeUsersRegiment
  );

  /**
   * Delete User Game ID from Regiment
   * @route DELETE /pa/regiments/:regimentId/gameid/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/pa/regiments/:regimentId/gameid/:gameId",
    [authJwt.verifyRegiment],
    regimentController.removeGameId
  );
};
