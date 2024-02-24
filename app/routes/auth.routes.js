/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\auth.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:33:59 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * Forgot Password Route
   * @route POST /v2/auth/forgot
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   */
  app.post("/v2/auth/forgot", controller.forgot);

  /**
   * Reset Password Route
   * @route POST /v2/auth/reset/:token
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   */
  app.post("/v2/auth/reset/:token", controller.reset);

  /**
   * Signin Route
   * @route POST /v2/auth/signin
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   */
  app.post("/v2/auth/signin", controller.signin);

  /**
   * Signup Route
   * @route POST /v2/auth/signup
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @verify checkDuplicateUsernameOrEmail, checkRolesExisted
   */
  app.post(
    "/v2/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  /**
   * Update Password Route
   * @route PUT /v2/auth/:userId/updatePassword
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security verifyToken
   */
  app.put(
    "/v2/auth/:userId/updatePassword",
    [authJwt.verifyToken],
    controller.password
  );

  /**
   * Update Profile Route
   * @route PUT /v2/auth/:userId/updateProfile
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security verifyToken
   */
  app.put(
    "/v2/auth/:userId/updateProfile",
    [authJwt.verifyToken],
    controller.profile
  );
  app.put("/v2/auth/:userId/syncPic", controller.profilePic);

  /**
   * Set Moderator Route
   * @route PUT /v2/auth/:userId/setModerator
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security JWT
   */
  app.put(
    "/v2/auth/:memberId/setModerator",
    [authJwt.verifyToken],
    controller.setModerator
  );

  /**
   * Set Moderator Discord Route
   * @route PUT /v2/auth/:userId/setModeratorDiscord
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security checkBearerToken
   */
  app.put(
    "/v2/auth/:memberId/setModeratorDiscord",
    [authJwt.checkBearerToken],
    controller.setModerator
  );

  /**
   * Remove Moderator Route
   * @route PUT /v2/auth/:userId/removeModerator
   * @group Auth
   * @returns {object} 200 - An object containing the user's token and user information
   * @security verifyToken
   */
  app.put(
    "/v2/auth/:memberId/removeModerator",
    [authJwt.verifyToken],
    controller.removeModerator
  );
};
