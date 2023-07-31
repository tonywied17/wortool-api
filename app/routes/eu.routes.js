/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\eu.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:22:54 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * EU Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const eu = require("../controllers/eu.controller.js");
  const router = require("express").Router();

  // ! GET Routes //

  /**
   * Get All EU Events
   * @route GET /pa/eu
   * @group EU
   * @returns {object} 200 - An object containing the EU Scheduled events
   */
  router.get("/", eu.findAll);

  /**
   * Get All EU Events By Day
   * @route GET /pa/eu/:day
   * @group EU
   * @returns {object} 200 - An object containing the EU Scheduled events for the day
   */
  router.get("/:day", eu.findAllByDay);

  app.use("/pa/eu", router);
};
