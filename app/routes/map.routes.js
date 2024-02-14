/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\map.routes.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp57090\public_html\api.wortool.com\wor-api\app\routes
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed February 14th 2024 2:58:30 
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

  // GET Routes
  router.get("/", maps.findAll);
  router.get("/new", maps.findAllMaps);
  router.get("/:id", maps.findOne); 

  // GET Routes for specific IDs
  router.get("/new/:id", maps.findOneMap);

  // POST Routes
  router.post("/new", maps.createMap);

  // PUT Routes
  router.put("/new/map/:id", maps.updateMap);
  router.put("/new/regiment/:id", maps.updateMapRegiment);
  router.put("/new/unit/:id", maps.updateMapUnit);

  app.use("/v2/maps", router);
};
