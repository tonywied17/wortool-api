/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\steam.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:38:35 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

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

  // ! GET Routes //

  /**
   * Get All Steam Data By Steam ID
   * @route GET /pa/steamid/:id
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
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
  
  /**
   * Get All Verbose Steam Data By Steam ID
   * @route GET /pa/steamid/:id/verbose
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/pa/steamid/:id/verbose", async (req, res) => {
    const id = req.params.id;
    const appId = req.query.appId || 424030;
  
    try {
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${id}`
      );
      const liveSteamData = response.data.response.players[0];
  
      const responseData = {};
  
      if (liveSteamData) {
        responseData.liveSteamData = liveSteamData;
      }
  
      try {
        const recentPlayedResponse = await axios.get(
          `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const recentPlayedData = recentPlayedResponse.data; 

        if (recentPlayedData) {
          responseData.recentPlayedGames = recentPlayedData;
        }
      } catch (error) {}
  
      try {
        const friendListResponse = await axios.get(
          `https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${steamApiKey}&steamid=${id}&relationship=friend`
        );
        const friendListData = friendListResponse.data;
  
        if (friendListData) {
          responseData.friendListData = friendListData;
        }
      } catch (error) {}
  
      try {
        const gameStatsResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const liveGameStats = gameStatsResponse.data.playerstats.stats;
  
        if (liveGameStats) {
          responseData.GameStats = liveGameStats;
        }
      } catch (error) {}
  
      try {
        const gameAchievementsResponse = await axios.get(
          `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${steamApiKey}&steamid=${id}`
        );
        const liveGameAchievements = gameAchievementsResponse.data;

        if (liveGameAchievements) {
          responseData.GameAchievements = liveGameAchievements;
        }
      } catch (error) {}
  

      try {
        const gameOwnedResponse = await axios.get(
          `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${id}&format=json`
        );
        const liveGameOwned = gameOwnedResponse.data;

        if (liveGameOwned) {
          responseData.GamesOwned = liveGameOwned;
        }
      } catch (error) {}


      res.json(responseData);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });
  
  /**
   * Get All Steam IDs
   * @route GET /pa/steamids/
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/pa/steamids/", steamid.findAll);

  /**
   * Get Game Details of Steam App
   * @route GET /pa/steam/appnews
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
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

  /**
   * Get Game News of Steam App
   * @route GET /pa/steam/appnews
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
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

  // ! Post Routes //

  /**
   * Create or Update Steam ID
   * @route POST /pa/steamid/:steamId
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.post(
    "/pa/steamid/:steamId",
    [authJwt.verifyToken],
    steamid.createOrUpdate
  );

  // ! Delete Routes

  /**
   * Delete Steam ID
   * @route DELETE /pa/steamid/:steamId
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.delete("/pa/steamid/:steamId", [authJwt.verifyToken], steamid.delete);
};
