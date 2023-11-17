/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\auth.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu November 16th 2023 7:27:14 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

/**
 * Auth Routes
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


  // ! POST Routes //


  /**
   * Forgot Login Post Route (Sendmail)
   */
  app.post("/pa/auth/forgot", controller.forgot);
  
  /**
   * Token reset password
   */
  app.post('/pa/auth/reset/:token', controller.reset);

  /**
   * Signin Route
   * @route POST /pa/auth/signin
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.post("/pa/auth/signin", controller.signin);

  /**
   * Signup Route
   * @route POST /pa/auth/signup
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.post(
    "/pa/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  /**
   * Update Password Route
   * @route PUT /pa/auth/:userId/updatePassword
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.put(
    "/pa/auth/:userId/updatePassword",
    [authJwt.verifyToken],
    controller.password
  );

  /**
   * Update Profile Route
   * @route PUT /pa/auth/:userId/updateProfile
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.put(
    "/pa/auth/:userId/updateProfile",
    [authJwt.verifyToken],
    controller.profile
  );

  /**
   * Set Moderator Route
   * @route PUT /pa/auth/:userId/setModerator
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.put(
    "/pa/auth/:memberId/setModerator",
    [authJwt.verifyToken],
    controller.setModerator
  );

  /**
   * Remove Moderator Route
   * @route PUT /pa/auth/:userId/removeModerator
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.put(
    "/pa/auth/:memberId/removeModerator",
    [authJwt.verifyToken],
    controller.removeModerator
  );

};
