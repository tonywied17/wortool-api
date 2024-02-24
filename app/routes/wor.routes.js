/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\wor.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Saturday July 15th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:59:00 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const wor = require("../controllers/wor.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * Get All WOR Recaps
   * @route GET /v2/wor/recaps
   * @group WOR
   * @returns {object} 200 - An object containing the WOR recaps
   */
  app.get("/v2/wor/recaps", wor.findAll);

  
  // ! POST Routes

  /**
   * Create WOR Recap
   * @route POST /v2/wor/recap
   * @group WOR
   * @returns {object} 200 - An object containing the WOR recap
   */
  app.post(
    "/v2/wor/server",
    // [authJwt.verifyToken, authJwt.isAdmin],
    wor.storeRecap
  );
};


