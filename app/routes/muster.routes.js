module.exports = app => {
  const muster = require("../controllers/muster.controller.js");
  const router = require("express").Router();

  router.get("/", muster.findAll);

  router.get("/:id", muster.findOne);

  app.use('/pa/muster', router);
};
