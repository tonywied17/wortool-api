module.exports = (app) => {
  const eu = require("../controllers/eu.controller.js");
  const router = require("express").Router();

  /**
   * ROUTES
   */

  // Get Routes
  router.get("/", eu.findAll);
  router.get("/:day", eu.findAllByDay);

  app.use("/pa/eu", router);
};
