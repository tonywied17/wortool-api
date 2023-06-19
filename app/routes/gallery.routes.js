module.exports = (app) => {
  const gallery = require("../controllers/gallery.controller.js");
  const router = require("express").Router();

  /**
   * ROUTES
   */

  // Get Routes
  router.get("/", gallery.findAll);
  router.get("/:id", gallery.findOne);

  app.use("/pa/gallery", router);
};
