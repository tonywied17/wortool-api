/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\map.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:26:30 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Map Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const maps = require("../controllers/map.controller.js");
  const router = require("express").Router();


  // ! Get Routes //

  /**
   * Get All Maps
   * @route GET /pa/maps
   * @group Maps
   * @returns {object} 200 - An object containing the maps
   */
  router.get("/", maps.findAll);

  /**
   * Get All Maps with appended regiment arrays
   * @route GET /pa/maps/big
   * @group Maps
   */
  router.get("/big", maps.findAllBig);

  /**
   * Get A Single Map By ID
   * @route GET /pa/maps/:id
   * @group Maps
   * @returns {object} 200 - An object containing the map
   */
  router.get("/:id", maps.findOne);


  app.use("/pa/maps", router);
};