const discordController = require("../controllers/discord.controller");
const axios = require('axios');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  

  app.get('/pa/steam/appdetails', async (req, res) => {
    try {
      const { appid } = req.query;
      const steamApiKey = '8D14E72B2DBB6A1E04D9F9C3B4F2D550'; // Replace with your actual Steam API Key
  
      // Make the Steam API request
      const response = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&key=${steamApiKey}`);
  
      // Return the response data to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching Steam API:', error);
      res.status(500).json({ error: 'Failed to fetch data from Steam API' });
    }
  });

  app.get('/pa/steam/appnews', async (req, res) => {
    try {
      const { appid } = req.query;
      const steamApiKey = '8D14E72B2DBB6A1E04D9F9C3B4F2D550'; // Replace with your actual Steam API Key
  
      // Make the Steam API request
      const response = await axios.get(`http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appid}&count=5&maxlength=300&format=json&key=${steamApiKey}`);
  
      // Return the response data to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching Steam API:', error);
      res.status(500).json({ error: 'Failed to fetch data from Steam API' });
    }
  });

  app.get("/pa/discord/guild/:id/get", discordController.findOneGuild);
  app.get("/pa/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/user/:userId/get", discordController.findOneUserMsg);
  app.get("/pa/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  app.get("/pa/discord/destroy", discordController.destroyBot);

  app.get('/pa/discord/auth/', discordController.auth);

  app.get('/pa/discord/authJSON/', discordController.authJSON);

  // Testing routes
  app.get('/pa/discord/', (req, res) => {
    const state = req.query.state;
  
    res.send(`
      <script>
        // Automatically redirect to the OAuth URL with the state parameter
        window.location.href = "${process.env.OAUTH_URL}&state=${state}";
      </script>
    `);
  });
  

  
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
