module.exports = app => {
    const muster = require("../controllers/muster.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all muster items
    router.get("/", muster.findAll);
  
    // Retrieve a single muster item with id
    router.get("/:id", muster.findOne);
  
    app.use('/pa/muster', router);
  };
  