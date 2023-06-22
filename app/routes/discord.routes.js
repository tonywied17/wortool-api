const discordController = require("../controllers/discord.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // https://api.tonewebdesign.com/pa/discord/guild/681641606398607401/channels
  app.get("/pa/discord/guild/:id/channels", discordController.findGuildChannels);

  // https://api.tonewebdesign.com/pa/discord/users
  app.get("/pa/discord/users", discordController.findAll);

  // https://api.tonewebdesign.com/pa/discord/user/11 (user id not discord pkey)
  app.get("/pa/discord/user/:userId", discordController.findOne);

  // https://api.tonewebdesign.com/pa/discord/guild/681641606398607401/user/281639399152943105/get
  app.get("/pa/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);

  // https://api.tonewebdesign.com/pa/discord/guild/850786736756883496/channel/901993697888051200/msg/test/get
  app.get("/pa/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  
  // https://api.tonewebdesign.com/pa/discord/guild/681641606398607401/get
  app.get("/pa/discord/guild/:id/get", discordController.findOneGuild);
  
  app.get("/pa/discord/guild/:guildId/channel/:channelId/webhook", discordController.createWebhook);


  // Delete Routes
  app.delete(
    "/pa/discord/user/:userId/remove",
    discordController.deleteOneUser
  )

  // OAUTH2 Routes
  app.get('/pa/discord/auth/', discordController.auth);
  
  app.get('/pa/discord/', (req, res) => {
    const state = req.query.state;
  
    res.send(`
      <script>
        // Automatically redirect to the OAuth URL with the state parameter
        window.location.href = "${process.env.OAUTH_URL}&state=${state}";
      </script>
    `);
  });


};
