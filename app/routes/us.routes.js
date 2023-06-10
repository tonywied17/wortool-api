module.exports = app => {
    const us = require("../controllers/us.controller.js");
    const router = require("express").Router();
  
    router.get("/", us.findAll);
  
    router.get("/:day", us.findAllByDay);

    app.use('/pa/us', router);
  };
  