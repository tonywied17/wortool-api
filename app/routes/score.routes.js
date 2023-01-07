module.exports = app => {
    const score = require("../controllers/score.controller.js");
  
    var router = require("express").Router();
  
    // Retrieve all score items
    router.get("/", score.findAll);
  

    app.use('/pa/score', router);
  };
  