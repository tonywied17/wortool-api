/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\steam.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:58:34 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */
require("dotenv").config({ path: "/home/wortool/envs/wor/.env" });
const axios = require("axios");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * Get All Steam Data By Steam ID
   * @route GET /v2/steamid/:id
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/v2/steamid/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Received ID:", id);
      const steamApiKey = process.env.STEAM_API_KEY;
      const response = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${id}`
      );
      console.log("Steam API Response:", response.data);
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching Steam API:", error);
      res.status(500).json({ error: "Failed to fetch data from Steam API" });
    }
  });

  /**
   * Get All Verbose Steam Data By Steam ID
   * @route GET /v2/steamid/:id/verbose
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/v2/steamid/:id/verbose", async (req, res) => {
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
   * Get Game Details of Steam App
   * @route GET /v2/steam/appnews
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/v2/steam/appdetails", async (req, res) => {
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
   * @route GET /v2/steam/appnews
   * @group Steam
   * @returns {object} 200 - An object containing the steam data
   */
  app.get("/v2/steam/appnews", async (req, res) => {
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

  // ! Post Routes

  /**
   * Get Steam ID from Profile URL
   * @route POST /v2/getSteamId
   * @group Steam
   * @param {string} profileUrl.body.required - The profile URL of the user
   * @returns {object} 200 - An object containing the steam ID
   */
  app.post("/v2/getSteamId", async (req, res) => {
    const { profileUrl } = req.body;
    const steamApiKey = process.env.STEAM_API_KEY;

    if (!profileUrl) {
      return res.status(400).json({ error: "Profile URL is required" });
    }

    const steamIdMatch = profileUrl.match(/\/id\/([^/]+)|\/profiles\/(\d+)/);
    if (!steamIdMatch) {
      return res.status(400).json({ error: "Invalid Steam profile URL" });
    }

    const vanityName = steamIdMatch[1];
    const steamId = steamIdMatch[2];

    console.log("Extracted Steam ID or Vanity Name:", vanityName || steamId);

    try {
      let resolvedSteamId64;

      if (vanityName) {
        const resolveResponse = await axios.get(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${steamApiKey}&vanityurl=${vanityName}`
        );
        const resolveData = resolveResponse.data;

        if (resolveData.response && resolveData.response.success === 1) {
          resolvedSteamId64 = BigInt(resolveData.response.steamid);
        } else {
          return res
            .status(400)
            .json({
              error:
                "Error fetching Steam ID. Please check the URL or try again later.",
            });
        }
      } else if (steamId) {
        // If it's a profile URL with a numeric ID
        resolvedSteamId64 = BigInt(steamId);
      }

      const steamIdY = resolvedSteamId64 % 2n;
      const steamIdZ = (resolvedSteamId64 >> 1n) % (1n << 31n);
      const steamIdUniverse = (resolvedSteamId64 >> 32n) & 0xffn;

      return res.json({
        steamId: `STEAM_${steamIdUniverse}:${steamIdY}:${steamIdZ}`,
        steamId3: `[U:1:${steamIdZ * 2n + steamIdY}]`,
        steamId64: resolvedSteamId64.toString(),
        profile: `https://steamcommunity.com/profiles/${resolvedSteamId64}`,
      });
    } catch (error) {
      console.error("Error fetching data from Steam API:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
