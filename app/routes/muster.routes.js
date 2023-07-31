/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\muster.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:27:30 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Muster Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const muster = require("../controllers/muster.controller.js");
  const router = require("express").Router();

  // ! Get Routes //

  /**
   * Get All Muster Events
   * @route GET /pa/muster
   * @group Muster
   * @returns {object} 200 - An object containing the Muster Scheduled events
   */
  router.get("/", muster.findAll);

  /**
   * Get All Muster By ID
   * @route GET /pa/muster/:id
   * @group Muster
   * @returns {object} 200 - An object containing the Muster Scheduled events
   */
  router.get("/:id", muster.findOne);

  app.use("/pa/muster", router);
};
