/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\regiment.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:57:18 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const regimentController = require("../controllers/regiment.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * Get All Regiments
   * @route GET /v2/regiments/
   * @group Regiments
   * @returns {object} 200 - An object containing the regiments
   */
  app.get("/v2/regiments/", regimentController.findAll);

  /**
   * Get Regiment By ID
   * @route GET /v2/regiments/:regimentId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   */
  app.get("/v2/regiments/:regimentId", regimentController.findOne);

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
   * @param {string} regimentId.path.required - The id of the regiment
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
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get(
    "/v2/regiments/:regimentId/schedules/region",
    regimentController.findRegimentByRegionTz
  );

  /**
   * Get Regiment Schedule Names By Regiment ID and Schedule Name
   * @route GET /v2/regiments/:regimentId/schedules/name
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get(
    "/v2/regiments/:regimentId/schedules/name",
    regimentController.findRegimentByScheduleName
  );

  /**
   * Get Regiment Schedule By Regiment ID and Schedule ID
   * @route GET /v2/regiments/:regimentId/schedules/:scheduleId
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment schedule
   * @param {string} guildId.path.required - The id of the regiment
   */
  app.get(
    "/v2/regiments/g/:guildId/discordGuild",
    regimentController.findDiscordGuild
  );

  /**
   * Update Regiment
   * @route POST /v2/regiments/:regimentId/update
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   * @security JWT verifyRegiment
   * @param {string} regimentId.path.required - The id of the regiment
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
   * @security JWT verifyRegiment
   * @param {string} regimentId.path.required - The id of the regiment
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
   * @security JWT verifyRegiment
   */
  app.post(
    "/v2/regiments/create",
    [authJwt.checkBearerToken],
    regimentController.createRegiment
  );

  /**
   * Update Regiment Member Count
   * @route POST /v2/regiments/:guildId/membercount
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment
   * @security JWT verifyRegiment
   * @param {string} guildId.path.required - The id of the guild
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
   * @param {string} regimentId.path.required - The id of the regiment
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
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.post(
    "/v2/regiments/:regimentId/schedules",
    [authJwt.verifyRegiment],
    regimentController.createSchedule
  );

  /**
   * Handle guildUpdate Discord Event (Member Count, Server Name, etc)
   */
  app.put(
    "/v2/regiments/updateDiscord",
    [authJwt.checkBearerToken],
    regimentController.updateDiscord
  );

  /**
   * Update Regiment Prefix (Message Commands/OLD)
   * ! Ready to delete probably
   * @route PUT /v2/regiments/:guildId/updatePrefix
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.put(
    "/v2/regiments/g/:guildId/updatePrefix",
    regimentController.updatePrefix
  );

  /**
   * Delete Regiment
   * @route DELETE /v2/regiments/:regimentId/delete
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} userId.path.required - The id of the user
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
   * @param {string} regimentId.path.required - The id of the regiment
   * @param {string} gameId.path.required - The id of the game
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
   * @param {string} regimentId.path.required - The id of the regiment
   * @param {string} scheduleId.path.required - The id of the schedule
   */
  app.delete(
    "/v2/regiments/:regimentId/schedules/:scheduleId",
    [authJwt.verifyRegiment],
    regimentController.removeSchedule
  );

  /**
   * Upload Regiment File
   * @route POST /v2/regiments/:regimentId/upload
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.post(
    "/v2/regiments/:regimentId/upload",
    [authJwt.verifyRegiment],
    regimentController.upload
  );

  /**
   * Upload Regiment Cover Photo
   * @route POST /v2/regiments/:regimentId/upload/cover
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.post(
    "/v2/regiments/:regimentId/upload/cover",
    [authJwt.verifyRegiment],
    regimentController.uploadCover
  );

  /**
   * Get Regiment Files
   * @route GET /v2/regiments/:regimentId/files
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment files
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get("/v2/regiments/:regimentId/files", regimentController.getListFiles);

  /**
   * Get Regiment Cover Photo
   * @route GET /v2/regiments/:regimentId/files/cover
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment cover photo
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get(
    "/v2/regiments/:regimentId/files/cover",
    regimentController.getCoverPhoto
  );

  /**
   * Download Regiment File
   * @route GET /v2/regiments/:regimentId/files/:name
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment file
   * @param {string} regimentId.path.required - The id of the regiment
   * @param {string} name.path.required - The name of the file
   */
  app.get("/v2/regiments/:regimentId/files/:name", regimentController.download);

  /**
   * Download Regiment Cover Photo
   * @route GET /v2/regiments/:regimentId/files/cover/:name
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment cover photo
   * @param {string} regimentId.path.required - The id of the regiment
   * @param {string} name.path.required - The name of the file
   */
  app.get(
    "/v2/regiments/:regimentId/files/cover/:name",
    regimentController.downloadCover
  );

  /**
   * Delete Regiment File
   * @route DELETE /v2/regiments/:regimentId/files/:name
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} regimentId.path.required - The id of the regiment
   * @param {string} name.path.required - The name of the file
   */
  app.delete(
    "/v2/regiments/:regimentId/files/:name",
    [authJwt.verifyRegiment],
    regimentController.remove
  );

  /**
   * Delete Regiment Cover Photo
   * @route DELETE /v2/regiments/:regimentId/files/cover/:name
   * @group Regiments
   * @security JWT verifyRegiment
   * @returns {object} 200 - An object containing the regiment
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.delete(
    "/v2/regiments/:regimentId/files/cover/:name",
    [authJwt.verifyRegiment],
    regimentController.removeCover
  );

  /**
   * Handle newRole Discord Event
   * @route POST /v2/regiments/:guildId/newRole
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/newRole",
    [authJwt.checkBearerToken],
    regimentController.newGuildRole
  );

  /**
   * Handle new roles array from guildCreate Discord Event
   * @route POST /v2/regiments/:guildId/newRoles
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/newRoles",
    [authJwt.checkBearerToken],
    regimentController.newGuildRoles
  );

  /**
   * Handle deleteRole Discord Event
   * @route POST /v2/regiments/:guildId/deleteRole
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/deleteRole",
    [authJwt.checkBearerToken],
    regimentController.deleteGuildRole
  );

  /**
   * Handle updateRole Discord Event
   * @route POST /v2/regiments/:guildId/updateRole
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/updateRole",
    [authJwt.checkBearerToken],
    regimentController.updateGuildRole
  );

  /**
   * Get All Guild Roles
   * @route GET /v2/regiments/:regimentId/roles
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment roles
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get("/v2/regiments/:regimentId/roles", regimentController.getGuildRoles);

  /**
   * Handle new channel array from guildCreate Discord Event
   * @route POST /v2/regiments/:guildId/newChannels
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/v2/regiments/:guildId/newChannels",
    [authJwt.checkBearerToken],
    regimentController.newGuildChannels
  );

  /**
   * Handle newChannel Discord Event
   * @route POST /v2/regiments/:guildId/newChannel
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/newChannel",
    [authJwt.checkBearerToken],
    regimentController.newGuildChannel
  );

  /**
   * Handle deleteChannel Discord Event
   * @route POST /v2/regiments/:guildId/deleteChannel
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   */
  app.post(
    "/v2/regiments/:guildId/deleteChannel",
    [authJwt.checkBearerToken],
    regimentController.deleteGuildChannel
  );
  
  /**
   * Handle updateChannel Discord Event
   * @route POST /v2/regiments/:guildId/updateChannel
   * @group Regiments
   * @security JWT checkBearerToken
   * @returns {object} 200 - An object containing the regiment
   * @param {string} guildId.path.required - The id of the guild
   */
  app.post(
    "/v2/regiments/:guildId/updateChannel",
    [authJwt.checkBearerToken],
    regimentController.updateGuildChannel
  );

  /**
   * Get All Guild Channels
   * @route GET /v2/regiments/:regimentId/channels
   * @group Regiments
   * @returns {object} 200 - An object containing the regiment channels
   * @param {string} regimentId.path.required - The id of the regiment
   */
  app.get(
    "/v2/regiments/:regimentId/channels",
    regimentController.getGuildChannels
  );
};
