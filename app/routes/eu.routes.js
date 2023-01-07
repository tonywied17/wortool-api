module.exports = app => {
    const eu = require("../controllers/eu.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all eu items
    router.get("/", eu.findAll);
  
    // Retrieve a todays eu item with id
    router.get("/:day", eu.findAllByDay);

    app.use('/pa/eu', router);
  };
  