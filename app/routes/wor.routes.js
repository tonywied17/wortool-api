/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\wor.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Saturday July 15th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:43:26 
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


  // ! GET Routes //

  /**
   * Get All WOR Recaps
   * @route GET /pa/wor/recaps
   * @group WOR
   * @returns {object} 200 - An object containing the WOR recaps
   */
  app.get("/pa/wor/recaps", wor.findAll);

  
  // ! POST Routes //

  /**
   * Create WOR Recap
   * @route POST /pa/wor/recap
   * @group WOR
   * @returns {object} 200 - An object containing the WOR recap
   */
  app.post(
    "/pa/wor/server",
    // [authJwt.verifyToken, authJwt.isAdmin],
    wor.storeRecap
  );
};


