const discordController = require("../controllers/discord.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/pa/discord/", discordController.findAll);
  app.get("/pa/discord/:id/get", discordController.findOne);
  app.get("/pa/discord/destroy", discordController.destroyBot);
};
