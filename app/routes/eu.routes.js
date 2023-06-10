module.exports = app => {
  const eu = require("../controllers/eu.controller.js");
  const router = require("express").Router();


  router.get("/", eu.findAll);

  router.get("/:day", eu.findAllByDay);


  app.use('/pa/eu', router);
};
