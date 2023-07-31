/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\gallery.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:25:22 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Gallery Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const gallery = require("../controllers/gallery.controller.js");
  const router = require("express").Router();


  // ! GET Routes //

  /**
   * Get All Gallery Images
   * @route GET /pa/gallery
   * @group Gallery
   * @returns {object} 200 - An object containing the gallery images
   */
  router.get("/", gallery.findAll);

  /**
   * Get A Single Gallery Image By ID
   * @route GET /pa/gallery/:id
   * @group Gallery
   * @returns {object} 200 - An object containing the gallery image
   */
  router.get("/:id", gallery.findOne);

  app.use("/pa/gallery", router);
};
