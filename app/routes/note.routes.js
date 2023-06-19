const { authJwt } = require("../middleware");
const noteController = require("../controllers/note.controller");

module.exports = function (app) {
  // CORS
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * ROUTES
   */

  // Get Routes
  app.get(
    "/pa/notes/map/:userId/:mapId",
    [authJwt.verifyToken],
    noteController.findNotesByUserAndMap
  );

  // Post Routes
  app.post(
    "/pa/notes/map/:userId/:mapId",
    [authJwt.verifyToken],
    noteController.createOrUpdateNote
  );

  // Delete Routes
};
