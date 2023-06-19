module.exports = (app) => {
  const maps = require("../controllers/map.controller.js");
  const router = require("express").Router();

  /**
   * ROUTES
   */

  // Get Routes
  router.get("/", maps.findAll);
  router.get("/big", maps.findAllBig);
  router.get("/:id", maps.findOne);

  // Post Routes

  // Delete Routes

  app.use("/pa/maps", router);
};
