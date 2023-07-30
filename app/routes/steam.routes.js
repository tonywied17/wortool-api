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
      console.log('Received ID:', id);
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${id}`
      );
      console.log('Steam API Response:', response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });
  
  
  
  // VERBOSE GET ROUTE FOR STEAMID
  app.get("/pa/steamid/:id/verbose", async (req, res) => {
    const id = req.params.id;
    const appId = req.query.appId || 424030; // Use the provided appId or set a default value (424030)
  
    try {
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${id}`
      );
      const liveSteamData = response.data.response.players[0];
  
      const responseData = {};
  
      // Check if liveSteamData exists, then append it to responseData
      if (liveSteamData) {
        responseData.liveSteamData = liveSteamData;
      }
  
      // Fetch player's game stats from Steam API (if available)
      try {
        // Fetch data from the GetRecentlyPlayedGames endpoint and append it to responseData
        const recentPlayedResponse = await axios.get(
          `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const recentPlayedData = recentPlayedResponse.data; // Change this based on the actual structure of the response
  
        // Check if recentPlayedData exists, then append it to responseData
        if (recentPlayedData) {
          responseData.recentPlayedGames = recentPlayedData;
        }
      } catch (error) {
        // If there is an error fetching recent played data, simply omit it from the responseData
      }
  
      // Fetch additional data from the GetFriendList endpoint and append it to responseData
      try {
        const friendListResponse = await axios.get(
          `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${id}&relationship=friend`
        );
        const friendListData = friendListResponse.data; // Change this based on the actual structure of the response
  
        // Check if friendListData exists, then append it to responseData
        if (friendListData) {
          responseData.friendListData = friendListData;
        }
      } catch (error) {
        // If there is an error fetching additional data, simply omit it from the responseData
      }
  
      try {
        // Fetch data from the GetUserStatsForGame endpoint and append it to responseData
        const gameStatsResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const liveGameStats = gameStatsResponse.data.playerstats.stats;
  
        // Check if liveGameStats exists, then append it to responseData
        if (liveGameStats) {
          responseData.GameStats = liveGameStats;
        }
      } catch (error) {
        // If there is an error fetching game stats, simply omit liveGameStats from the responseData
      }
  
      try {
        // Fetch data from the GetPlayerAchievements endpoint and append it to responseData
        const gameAchievementsResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const liveGameAchievements = gameAchievementsResponse.data;
  
        // Check if liveGameStats exists, then append it to responseData
        if (liveGameAchievements) {
          responseData.GameAchievements = liveGameAchievements;
        }
      } catch (error) {
        // If there is an error fetching game stats, simply omit liveGameStats from the responseData
      }
  

      try {
        // Fetch data from the GetPlayerAchievements endpoint and append it to responseData
        const gameOwnedResponse = await axios.get(
          `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${id}&format=json`
        );
        const liveGameOwned = gameOwnedResponse.data;
  
        // Check if liveGameStats exists, then append it to responseData
        if (liveGameOwned) {
          responseData.GamesOwned = liveGameOwned;
        }
      } catch (error) {
        // If there is an error fetching game stats, simply omit liveGameStats from the responseData
      }


      res.json(responseData);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });
  
  


  app.get("/pa/steamids/", steamid.findAll);

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
