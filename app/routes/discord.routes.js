const discordController = require("../controllers/discord.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Testing routes
  app.get("/pa/discord/", discordController.findAll);
  app.get("/pa/discord/guild/:id/get", discordController.findOneGuild);
  app.get("/pa/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/user/:userId/get", discordController.findOneUserMsg);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  app.get("/pa/discord/destroy", discordController.destroyBot);
};
