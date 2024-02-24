/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\routes\muster.user.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:43:54 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

module.exports = (app) => {
  const musterUserController = require("../controllers/muster.user.controller.js");
  const router = require("express").Router();

  /**
   * Get All Muster Users
   * @route GET /v2/musteruser
   * @group MusterUser
   * @returns {object} 200 - An object containing the Muster User items
   */
  router.get("/reg/:regimentId", musterUserController.findAll);

  /**
   * Get All Muster Users By Discord ID
   * @route GET /v2/musteruser/discord/:guildId
   * @group MusterUser
   * @returns {object} 200 - An object containing the Muster User items
   */
  router.get("/discord/:guildId", musterUserController.findAllByGuild);

  /**
   * Get Muster User By Discord ID
   * @route GET /v2/musteruser/:discordId
   * @group MusterUser
   * @returns {object} 200 - An object containing the Muster User item
   */
  router.get("/reg/:regimentId/user/:discordId", musterUserController.findOne);

  /**
   * Update Muster User By Discord ID
   * @route PUT /v2/musteruser/:discordId
   * @group MusterUser
   * @returns {object} 200 - Success message
   */
  router.put("/update", musterUserController.update);

  /**
   * Create Muster User
   * @route POST /v2/musteruser
   * @group MusterUser
   * @returns {object} 200 - An object containing the created Muster User item
   */
  router.post("/create", musterUserController.create);

  /**
   * Delete Muster User By Discord ID
   * @route DELETE /v2/musteruser/:discordId
   * @group MusterUser
   * @returns {object} 200 - Success message
   */
  router.put("/discord/increase/", musterUserController.updateAll);

  /**
   * Increment Events
   * @route PUT /v2/musteruser/incr-events
   * @group MusterUser
   * @returns {object} 200 - Success message
   */
  router.put("/incr-events", musterUserController.incrementEvents);

  /**
   * Increment Drills
   * @route PUT /v2/musteruser/incr-drills
   * @group MusterUser
   * @returns {object} 200 - Success message
   */
  router.put("/incr-drills", musterUserController.incrementDrills);

  app.use("/v2/musteruser", router);
};
