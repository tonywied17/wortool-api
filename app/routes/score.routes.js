module.exports = (app) => {
  const score = require("../controllers/score.controller.js");
  var router = require("express").Router();

  /**
   * ROUTES
   */

  // Get Routes
  router.get("/", score.findAll);

  // Post Routes

  // Delete Routes

  app.use("/pa/score", router);
};
