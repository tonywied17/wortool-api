/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\regiment.routes.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp30839\public_html\api.tonewebdesign.com\pa-api\app\routes
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue November 21st 2023 11:32:24 
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

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /pa/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/pa/regiments/:regimentId/schedules/day/",
    regimentController.findScheduleByDay
  );

    /**
   * Get Regiment Schedule By Guild ID
   * @route GET /pa/regiments/:guildId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
    app.post(
      "/pa/regiments/discord/:guildId/schedules/day/",
      regimentController.findScheduleByDayGuildId
    );

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /pa/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/pa/regiments/:regimentId/schedules",
    regimentController.findSchedulesByRegimentId
  );

  /**
   * Get Regiment Schedule By Regiment ID and Region
   * @route GET /pa/regiments/:regimentId/schedules/region
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/pa/regiments/:regimentId/schedules/region",
    regimentController.findRegimentByRegionTz
  );

  //Get regiment schedule by regiment id and schedule_name
  app.get(
    "/pa/regiments/:regimentId/schedules/name",
    regimentController.findRegimentByScheduleName
  );

  app.get(
    "/pa/regiments/g/:guildId/discordGuild",
    regimentController.findDiscordGuild
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
    [authJwt.verifyDomainAndPath, authJwt.verifyRegiment],
    
    regimentController.update
  );

  /**
   * Create Regiment
   * @route POST /pa/regiments/create
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/pa/regiments/create",
    [authJwt.checkBearerToken],
    regimentController.createRegiment
  );

  /**
   * Update memberCount for regiment guild
   * 
   */
  app.post(
    "/pa/regiments/:guildId/membercount",
    [authJwt.checkBearerToken],
    regimentController.updateMemberCount
  );

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
  );

  /**
   * Create Regiment Schedule
   * @route POST /pa/regiments/:regimentId/schedules
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/pa/regiments/:regimentId/schedules",
    [authJwt.verifyRegiment],
    regimentController.createSchedule
  );

  /**
   * Update Regiment Schedule
   * @route PUT /pa/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  // app.put(
  //   "/pa/regiments/:regimentId/schedules/:scheduleId",
  //   [authJwt.verifyRegiment],
  //   regimentController.updateSchedule
  // );

  //update discord avatar and servername
  app.put(
    "/pa/regiments/updateDiscord",
    [authJwt.checkBearerToken],
    regimentController.updateDiscord
  );
  
  //Upate regiment discord guilds prefix column
  app.put(
    "/pa/regiments/g/:guildId/updatePrefix",
    regimentController.updatePrefix
  );
  // ! Delete Routes //

  /**
   * Delete Regiment
   * @route DELETE /pa/regiments/:regimentId/delete
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/pa/regiments/:userId/remove",
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

  /**
   * Delete Regiment Schedule
   * @route DELETE /pa/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/pa/regiments/:regimentId/schedules/:scheduleId",
    [authJwt.verifyRegiment],
    regimentController.removeSchedule
  );

  //uploading
  app.post(
    "/pa/regiments/:regimentId/upload",
    [authJwt.verifyRegiment],
    regimentController.upload
  );

  app.post(
    "/pa/regiments/:regimentId/upload/cover",
    [authJwt.verifyRegiment],
    regimentController.uploadCover
  );

  app.get(
    "/pa/regiments/:regimentId/files",
    regimentController.getListFiles
  );

  app.get(
    "/pa/regiments/:regimentId/files/cover",
    regimentController.getCoverPhoto
  );

  app.get(
    "/pa/regiments/:regimentId/files/:name",
    regimentController.download
  );

  app.get(
    "/pa/regiments/:regimentId/files/cover/:name",
    regimentController.downloadCover
  );

  app.delete(
    "/pa/regiments/:regimentId/files/:name",
    [authJwt.verifyRegiment],
    regimentController.remove
  );

  app.delete(
    "/pa/regiments/:regimentId/files/cover/:name",
    [authJwt.verifyRegiment],
    regimentController.removeCover
  );


};