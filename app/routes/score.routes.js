/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\score.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:35:13 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Score Routes
 * @param {*} app 
 */
module.exports = (app) => {
  const score = require("../controllers/score.controller.js");
  var router = require("express").Router();

  // ! Get Routes

  /**
   * Get All Scores
   * @route GET /pa/score
   * @group Score
   * @returns {object} 200 - An object containing the scores
   */
  router.get("/", score.findAll);

  app.use("/pa/score", router);
};
