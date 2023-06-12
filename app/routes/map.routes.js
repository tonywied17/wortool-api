module.exports = app => {
  const maps = require("../controllers/map.controller.js");

  var router = require("express").Router();

  // Retrieve all Maps
  router.get("/", maps.findAll);

  // Retrieve all Maps and their big map object
  router.get("/big", maps.findAllBig);

  // Retrieve a single Map with id
  router.get("/:id", maps.findOne);

  app.use('/pa/maps', router);
};
