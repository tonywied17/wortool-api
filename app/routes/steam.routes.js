require("dotenv").config({ path: "/home/tonewebdesign/envs/pa/.env" });
const axios = require("axios");
const { authJwt } = require("../middleware");
const steamid = require("../controllers/steamid.controller");


module.exports = function (app) {
  // CORS
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * ROUTES
   */

  // Get Routes

  //https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=8D14E72B2DBB6A1E04D9F9C3B4F2D550&steamids=76561198000469634
  app.get("/pa/steamid/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${id}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });



  app.get("/pa/steamids/", steamid.findAll);
  app.get("/pa/steamid/:id", steamid.findOne);
  app.get("/pa/steam/appdetails", async (req, res) => {
    try {
      const { appid } = req.query;
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${appid}&key=${steamApiKey}`
      );
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });

  app.get("/pa/steam/appnews", async (req, res) => {
    try {
      const { appid } = req.query;
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `http://api.steampowered.com/ISteamNews/GetNewsForApp/v0002/?appid=${appid}&count=5&maxlength=300&format=json&key=${steamApiKey}`
      );

      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });

  // Post Routes
  app.post(
    "/pa/steamid/:steamId",
    [authJwt.verifyToken],
    steamid.createOrUpdate
  );

  // Delete Routes
  app.delete("/pa/steamid/:steamId", [authJwt.verifyToken], steamid.delete);
};
