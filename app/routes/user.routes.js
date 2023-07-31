/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\user.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:41:11 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

/**
 * User Routes
 * @param {*} app 
 */
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
   * Vet Public Access
   * @route GET /pa/vet/all
   * @group Vet
   * @returns {object} 200 - An object containing the vet data
   */
  app.get("/pa/vet/all", controller.allAccess);


  // ! POST Routes //

  /**
   * Vet User Access
   * @route POST /pa/vet/user
   * @group Vet
   * @returns {object} 200 - An object containing the vet data
   */
  app.post("/pa/vet/user/", [authJwt.verifyToken], controller.userBoard);

  /**
   * Vet Moderator Access
   * @route POST /pa/vet/mod
   * @group Vet
   * @returns {object} 200 - An object containing the vet data
   */
  app.post(
    "/pa/vet/mod/",
    [authJwt.isModerator],
    controller.moderatorBoard
  )

  /**
   * Vet Admin Access
   * @route POST /pa/vet/admin
   * @group Vet
   * @returns {object} 200 - An object containing the vet data
   */
  app.post(
    "/pa/vet/admin/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  
};
