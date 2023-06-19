const discordController = require("../controllers/discord.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/pa/discord/guild/:id/get", discordController.findOneGuild);
  app.get("/pa/discord/users", discordController.findAll);
  app.get("/pa/discord/user/:userId", discordController.findOne);



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
