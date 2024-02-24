/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\map.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:42:27 
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

  /**
   * Retrieve all maps from the database. (OLD)
   * @route GET /v2/maps
   * @group Maps
   * @returns {object} 200 - An object containing the maps
   */
  router.get("/", maps.findAll);

  /**
   * Retrieve all maps from the database with less restructuring.
   * @route GET /v2/maps/new
   * @group Maps
   * @returns {object} 200 - An object containing the maps
   */
  router.get("/new", maps.findAllMaps);

  /**
   * Retrieve all maps from the database (Verbose).
   * @route GET /v2/maps/new-verbose
   * @group Maps
   * @returns {object} 200 - An object containing the maps
   */
  router.get("/new-verbose", maps.findAllMapsVerbose);

  /**
   * Retrieve all maps from the database. (OLD)
   * @route GET /v2/maps
   * @group Maps 
   * @returns {object} 200 - An object containing the maps
   * @param {string} id.path.required - The id of the map
   */
  router.get("/:id", maps.findOne); 

  /**
   * Retrieve a single map from the database. (Verbose)
   * @route GET /v2/maps/new/:id
   * @group Maps
   * @returns {object} 200 - An object containing the map
   * @param {string} id.path.required - The id of the map
   */
  router.get("/new/:id", maps.findOneMap);


  // ! POST Routes

  /**
   * Create a new map in the database.
   * @route POST /v2/maps/new
   * @group Maps
   * @returns {object} 200 - An object containing the map
   */
  router.post("/new", maps.createMap);


  // ! PUT Routes

  /**
   * Update a map in the database.
   * @route PUT /v2/maps/new/:id
   * @group Maps
   * @returns {object} 200 - An object containing the map
   * @param {string} id.path.required - The id of the map
   */
  router.put("/new/map/:id", maps.updateMap);

  /**
   * Update a map regiment in the database.
   * @route PUT /v2/maps/new/regiment/:id
   * @group Maps
   * @returns {object} 200 - An object containing the map
   */
  router.put("/new/regiment/:id", maps.updateMapRegiment);

  /**
   * Update a map regiment weapons in the database.
   * @route PUT /v2/maps/new/regiment/:id
   * @group Maps
   * @returns {object} 200 - An object containing the map
   * @param {string} id.path.required - The id of the map
   */
  router.put("/new/unit/:id", maps.updateMapUnit);

  
  app.use("/v2/maps", router);
};
