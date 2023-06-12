module.exports = app => {
    const us = require("../controllers/us.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all us items
    router.get("/", us.findAll);
  
    // Retrieve a todays us item with id
    router.get("/:day", us.findAllByDay);

    app.use('/pa/us', router);
  };
  