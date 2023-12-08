/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\regiment.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri December 8th 2023 10:23:52 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const {
  authJwt,
} = require("../middleware");
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
   * @route GET /v2/regiments/
   * @group Regiments
   * @returns {object} 200 - An object containing the regiments
   */
  app.get(
    "/v2/regiments/",
    regimentController.findAll
  );


  /**
   * Get Regiment By ID
   * @route GET /v2/regiments/:regimentId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/v2/regiments/:regimentId",
    regimentController.findOne
  );

  /**
   * Get Users of Regiment By Regiment ID
   * @route GET /v2/regiments/:regimentId/users
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users
   */
  app.get(
    "/v2/regiments/:regimentId/users",
    regimentController.findUsersByRegimentId
  );

  /**
   * Get Game IDs of Regiment User's By Regiment ID
   * @route GET /v2/regiments/:regimentId/gameids
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/v2/regiments/:regimentId/gameids",
    regimentController.findGameIdsByRegimentId
  );

  /**
   * Get the Regiment of a User By Steam ID
   * @route GET /v2/regiments/gameid/:steamId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/v2/regiments/gameid/:steamId",
    regimentController.findRegimentBySteamId
  );

  /**
   * Get Steam Data for Regiment User by Game ID (not Steam ID)
   * @route GET /v2/regiments/:regimentId/gameids/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/v2/regiments/:regimentId/gameids/:gameId",
    regimentController.findGameIdsByGameId
  );

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /v2/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/v2/regiments/:regimentId/schedules/day/",
    regimentController.findScheduleByDay
  );

    /**
   * Get Regiment Schedule By Guild ID
   * @route GET /v2/regiments/:guildId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
    app.post(
      "/v2/regiments/discord/:guildId/schedules/day/",
      regimentController.findScheduleByDayGuildId
    );

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /v2/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/v2/regiments/:regimentId/schedules",
    regimentController.findSchedulesByRegimentId
  );

  /**
   * Get Regiment Schedule By Regiment ID and Region
   * @route GET /v2/regiments/:regimentId/schedules/region
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/v2/regiments/:regimentId/schedules/region",
    regimentController.findRegimentByRegionTz
  );

  //Get regiment schedule by regiment id and schedule_name
  app.get(
    "/v2/regiments/:regimentId/schedules/name",
    regimentController.findRegimentByScheduleName
  );

  app.get(
    "/v2/regiments/g/:guildId/discordGuild",
    regimentController.findDiscordGuild
  );


  // ! Post Routes //

  /**
   * Update Regiment
   * @route POST /v2/regiments/:regimentId/update
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/v2/regiments/:regimentId/update",
    [authJwt.verifyRegiment],
    regimentController.update
  );

  /**
   * Update Regiment from Public Routes (Used for Guild Icon and Name Changes)
   * @route POST /v2/regiments/:regimentId/change
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/v2/regiments/:regimentId/change",
    [authJwt.verifyRegiment],
    
    regimentController.update
  );

  /**
   * Create Regiment
   * @route POST /v2/regiments/create
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/v2/regiments/create",
    [authJwt.checkBearerToken],
    regimentController.createRegiment
  );

  /**
   * Update memberCount for regiment guild
   * 
   */
  app.post(
    "/v2/regiments/:guildId/membercount",
    [authJwt.checkBearerToken],
    regimentController.updateMemberCount
  );

  /**
   * Add User Game ID to Regiment
   * @route POST /v2/regiments/:regimentId/gameid
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/v2/regiments/:regimentId/gameid",
    // [authJwt.verifyRegiment],
    regimentController.addGameId
  );

  /**
   * Create Regiment Schedule
   * @route POST /v2/regiments/:regimentId/schedules
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/v2/regiments/:regimentId/schedules",
    [authJwt.verifyRegiment],
    regimentController.createSchedule
  );

  /**
   * Update Regiment Schedule
   * @route PUT /v2/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  // app.put(
  //   "/v2/regiments/:regimentId/schedules/:scheduleId",
  //   [authJwt.verifyRegiment],
  //   regimentController.updateSchedule
  // );

  //update discord avatar and servername
  app.put(
    "/v2/regiments/updateDiscord",
    [authJwt.checkBearerToken],
    regimentController.updateDiscord
  );
  
  //Upate regiment discord guilds prefix column
  app.put(
    "/v2/regiments/g/:guildId/updatePrefix",
    regimentController.updatePrefix
  );
  // ! Delete Routes //

  /**
   * Delete Regiment
   * @route DELETE /v2/regiments/:regimentId/delete
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/v2/regiments/:userId/remove",
    regimentController.removeUsersRegiment
  );

  /**
   * Delete User Game ID from Regiment
   * @route DELETE /v2/regiments/:regimentId/gameid/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/v2/regiments/:regimentId/gameid/:gameId",
    [authJwt.verifyRegiment],
    regimentController.removeGameId
  );

  /**
   * Delete Regiment Schedule
   * @route DELETE /v2/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/v2/regiments/:regimentId/schedules/:scheduleId",
    [authJwt.verifyRegiment],
    regimentController.removeSchedule
  );

  //uploading
  app.post(
    "/v2/regiments/:regimentId/upload",
    [authJwt.verifyRegiment],
    regimentController.upload
  );

  app.post(
    "/v2/regiments/:regimentId/upload/cover",
    [authJwt.verifyRegiment],
    regimentController.uploadCover
  );

  app.get(
    "/v2/regiments/:regimentId/files",
    regimentController.getListFiles
  );

  app.get(
    "/v2/regiments/:regimentId/files/cover",
    regimentController.getCoverPhoto
  );

  app.get(
    "/v2/regiments/:regimentId/files/:name",
    regimentController.download
  );

  app.get(
    "/v2/regiments/:regimentId/files/cover/:name",
    regimentController.downloadCover
  );

  app.delete(
    "/v2/regiments/:regimentId/files/:name",
    [authJwt.verifyRegiment],
    regimentController.remove
  );

  app.delete(
    "/v2/regiments/:regimentId/files/cover/:name",
    [authJwt.verifyRegiment],
    regimentController.removeCover
  );


};