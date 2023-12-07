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
   * @route GET /wor/regiments/
   * @group Regiments
   * @returns {object} 200 - An object containing the regiments
   */
  app.get(
    "/wor/regiments/",
    regimentController.findAll
  );


  /**
   * Get Regiment By ID
   * @route GET /wor/regiments/:regimentId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/wor/regiments/:regimentId",
    regimentController.findOne
  );

  /**
   * Get Users of Regiment By Regiment ID
   * @route GET /wor/regiments/:regimentId/users
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users
   */
  app.get(
    "/wor/regiments/:regimentId/users",
    regimentController.findUsersByRegimentId
  );

  /**
   * Get Game IDs of Regiment User's By Regiment ID
   * @route GET /wor/regiments/:regimentId/gameids
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/wor/regiments/:regimentId/gameids",
    regimentController.findGameIdsByRegimentId
  );

  /**
   * Get the Regiment of a User By Steam ID
   * @route GET /wor/regiments/gameid/:steamId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get(
    "/wor/regiments/gameid/:steamId",
    regimentController.findRegimentBySteamId
  );

  /**
   * Get Steam Data for Regiment User by Game ID (not Steam ID)
   * @route GET /wor/regiments/:regimentId/gameids/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment users game/steam ids
   */
  app.get(
    "/wor/regiments/:regimentId/gameids/:gameId",
    regimentController.findGameIdsByGameId
  );

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /wor/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/wor/regiments/:regimentId/schedules/day/",
    regimentController.findScheduleByDay
  );

    /**
   * Get Regiment Schedule By Guild ID
   * @route GET /wor/regiments/:guildId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
    app.post(
      "/wor/regiments/discord/:guildId/schedules/day/",
      regimentController.findScheduleByDayGuildId
    );

  /**
   * Get Regiment Schedule By Regiment ID
   * @route GET /wor/regiments/:regimentId/schedules
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/wor/regiments/:regimentId/schedules",
    regimentController.findSchedulesByRegimentId
  );

  /**
   * Get Regiment Schedule By Regiment ID and Region
   * @route GET /wor/regiments/:regimentId/schedules/region
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   */
  app.get(
    "/wor/regiments/:regimentId/schedules/region",
    regimentController.findRegimentByRegionTz
  );

  //Get regiment schedule by regiment id and schedule_name
  app.get(
    "/wor/regiments/:regimentId/schedules/name",
    regimentController.findRegimentByScheduleName
  );

  app.get(
    "/wor/regiments/g/:guildId/discordGuild",
    regimentController.findDiscordGuild
  );


  // ! Post Routes //

  /**
   * Update Regiment
   * @route POST /wor/regiments/:regimentId/update
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/wor/regiments/:regimentId/update",
    [authJwt.verifyRegiment],
    regimentController.update
  );

  /**
   * Update Regiment from Public Routes (Used for Guild Icon and Name Changes)
   * @route POST /wor/regiments/:regimentId/change
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.put(
    "/wor/regiments/:regimentId/change",
    [authJwt.verifyDomainAndPath, authJwt.verifyRegiment],
    
    regimentController.update
  );

  /**
   * Create Regiment
   * @route POST /wor/regiments/create
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/wor/regiments/create",
    [authJwt.checkBearerToken],
    regimentController.createRegiment
  );

  /**
   * Update memberCount for regiment guild
   * 
   */
  app.post(
    "/wor/regiments/:guildId/membercount",
    [authJwt.checkBearerToken],
    regimentController.updateMemberCount
  );

  /**
   * Add User Game ID to Regiment
   * @route POST /wor/regiments/:regimentId/gameid
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/wor/regiments/:regimentId/gameid",
    // [authJwt.verifyRegiment],
    regimentController.addGameId
  );

  /**
   * Create Regiment Schedule
   * @route POST /wor/regiments/:regimentId/schedules
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/wor/regiments/:regimentId/schedules",
    [authJwt.verifyRegiment],
    regimentController.createSchedule
  );

  /**
   * Update Regiment Schedule
   * @route PUT /wor/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  // app.put(
  //   "/wor/regiments/:regimentId/schedules/:scheduleId",
  //   [authJwt.verifyRegiment],
  //   regimentController.updateSchedule
  // );

  //update discord avatar and servername
  app.put(
    "/wor/regiments/updateDiscord",
    [authJwt.checkBearerToken],
    regimentController.updateDiscord
  );
  
  //Upate regiment discord guilds prefix column
  app.put(
    "/wor/regiments/g/:guildId/updatePrefix",
    regimentController.updatePrefix
  );
  // ! Delete Routes //

  /**
   * Delete Regiment
   * @route DELETE /wor/regiments/:regimentId/delete
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/wor/regiments/:userId/remove",
    regimentController.removeUsersRegiment
  );

  /**
   * Delete User Game ID from Regiment
   * @route DELETE /wor/regiments/:regimentId/gameid/:gameId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/wor/regiments/:regimentId/gameid/:gameId",
    [authJwt.verifyRegiment],
    regimentController.removeGameId
  );

  /**
   * Delete Regiment Schedule
   * @route DELETE /wor/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   */
  app.delete(
    "/wor/regiments/:regimentId/schedules/:scheduleId",
    [authJwt.verifyRegiment],
    regimentController.removeSchedule
  );

  //uploading
  app.post(
    "/wor/regiments/:regimentId/upload",
    [authJwt.verifyRegiment],
    regimentController.upload
  );

  app.post(
    "/wor/regiments/:regimentId/upload/cover",
    [authJwt.verifyRegiment],
    regimentController.uploadCover
  );

  app.get(
    "/wor/regiments/:regimentId/files",
    regimentController.getListFiles
  );

  app.get(
    "/wor/regiments/:regimentId/files/cover",
    regimentController.getCoverPhoto
  );

  app.get(
    "/wor/regiments/:regimentId/files/:name",
    regimentController.download
  );

  app.get(
    "/wor/regiments/:regimentId/files/cover/:name",
    regimentController.downloadCover
  );

  app.delete(
    "/wor/regiments/:regimentId/files/:name",
    [authJwt.verifyRegiment],
    regimentController.remove
  );

  app.delete(
    "/wor/regiments/:regimentId/files/cover/:name",
    [authJwt.verifyRegiment],
    regimentController.removeCover
  );


};