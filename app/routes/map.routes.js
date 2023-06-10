module.exports = app => {
  const maps = require("../controllers/map.controller.js");
  const router = require("express").Router();


  router.get("/", maps.findAll);

  router.get("/big", maps.findAllBig);

  router.get("/:id", maps.findOne);


  app.use('/pa/maps', router);
};
