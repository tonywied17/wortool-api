module.exports = app => {
  const maps = require("../controllers/map.controller.js");

  var router = require("express").Router();

  // Retrieve all Maps
  router.get("/", maps.findAll);

  // Retrieve a single Map with id
  router.get("/:id", maps.findOne);

  app.use('/pa/maps', router);
};
