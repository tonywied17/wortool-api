module.exports = app => {
    const score = require("../controllers/score.controller.js");
    const router = require("express").Router();
  
    router.get("/", score.findAll);
  
    app.use('/pa/score', router);
  };
  