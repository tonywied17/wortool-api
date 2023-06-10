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
  app.get("/pa/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/user/:userId/get", discordController.findOneUserMsg);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  app.get("/pa/discord/destroy", discordController.destroyBot);
  app.get('/pa/discord/auth/', discordController.auth);
  app.get('/pa/discord/authJSON/', discordController.authJSON);


/**
 * 
 * Routes for testing the Discord OAuth2 flow
 * 
 */
  app.get('/pa/discord/', (req, res) => {
    res.send(`
        <div style="margin: 300px auto;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: sans-serif;"
        >
            <a 
                href="${process.env.OAUTH_URL}"
                style="outline: none;
                padding: 10px;
                border: none;
                font-size: 20px;
                margin-top: 20px;
                border-radius: 8px;
                background: #6D81CD;
                cursor:pointer;
                text-decoration: none;
                color: white;"
            >
            Login with Discord</a>
        </div>
    `)
  })


  app.get('/pa/discordJSON/', (req, res) => {
    res.send(`
        <div style="margin: 300px auto;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: sans-serif;"
        >
            <a 
                href="${process.env.OAUTH_URL2}"
                style="outline: none;
                padding: 10px;
                border: none;
                font-size: 20px;
                margin-top: 20px;
                border-radius: 8px;
                background: #6D81CD;
                cursor:pointer;
                text-decoration: none;
                color: white;"
            >
            Login with Discord</a>
        </div>
    `)
  })



};
