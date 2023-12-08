/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\note.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:47:25 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const { authJwt } = require("../middleware");
const noteController = require("../controllers/note.controller");

/**
 * Note Routes
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


  // ! Get Routes //

  /**
   * Get All Notes By User and Map
   * @route GET /v2/notes/map/:userId/:mapId
   * @group Notes
   * @returns {object} 200 - An object containing the notes
   */
  app.get(
    "/v2/notes/map/:userId/:mapId",
    [authJwt.verifyToken],
    noteController.findNotesByUserAndMap
  );

  // ! Post Routes //

  /**
   * Create or Update Note
   * @route POST /v2/notes/map/:userId/:mapId
   * @group Notes
   * @returns {object} 200 - An object containing the note
   */
  app.post(
    "/v2/notes/map/:userId/:mapId",
    [authJwt.verifyToken],
    noteController.createOrUpdateNote
  );

};
