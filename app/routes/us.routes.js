/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\us.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:39:43 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * US Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const us = require("../controllers/us.controller.js");
  const router = require("express").Router();

  // ! Get Routes //

  /**
   * Get All US Schedule
   * @route GET /pa/us/
   * @group US
   * @returns {object} 200 - An object containing the US schedule
   */
  router.get("/", us.findAll);

  /**
   * Get All US Schedule By Day
   * @route GET /pa/us/:day
   * @group US
   * @returns {object} 200 - An object containing the US schedule
   */
  router.get("/:day", us.findAllByDay);

  app.use("/pa/us", router);
};