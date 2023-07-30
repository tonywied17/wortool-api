const db = require("../models");
const Regiment = db.regiment;
const User = db.user;
const GameId = db.gameid;
const Schedule = db.schedule;
const axios = require("axios");

exports.findAll = async (req, res) => {
  try {

    const regiments = await Regiment.findAll();

    return res.status(200).json(regiments);
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving regiments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.regimentId;

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    return res.status(200).json(regiment);
  } catch (error) {
    console.error("Error retrieving regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.findUsersByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;

  try {
    const users = await User.findAll({
      where: {
        regimentId: regimentId,
      },
      attributes: { exclude: ['password'] },
    });

    const usersWithRoles = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const roles = await user.getRoles();
      let authorities = [];

      for (let j = 0; j < roles.length; j++) {
        authorities.push("ROLE_" + roles[j].name.toUpperCase());
      }

      usersWithRoles.push({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        discordId: user.discordId,
        regimentId: user.regimentId,
        roles: authorities,
      });
    }

    return res.status(200).json(usersWithRoles);
  } catch (err) {
    console.error("Error retrieving regiment:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.update = async (req, res) => {
  const id = req.params.regimentId;

  console.log(req.body)

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const updatedRegiment = await regiment.update(req.body);

    return res.status(200).json(updatedRegiment);
  } catch (error) {
    console.error("Error updating regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


exports.createRegiment = async (req, res) => {
  const { guildId, guildName, guildAvatar, guildInvite, ownerId, side } = req.body;

  try {
    let regiment = await Regiment.findOne({ where: { guild_id: guildId } });

    if (regiment) {
      // Guild ID already exists, check if the ownerId matches
      if (regiment.ownerId === ownerId) {
        // ownerId matches, update the record
        regiment = await Regiment.update(
          {
            regiment: guildName,
            guild_avatar: guildAvatar,
            invite_link: guildInvite,
            ownerId: ownerId,
            side: side,
          },
          { where: { guild_id: guildId } }
        );
      } else {
        // ownerId doesn't match, don't update
        return res.status(400).json({ error: "Owner ID mismatch. You're not authorized to update this regiment." });
      }
    } else {
      // Guild ID doesn't exist, create a new record
      regiment = await Regiment.create({
        guild_id: guildId,
        regiment: guildName,
        guild_avatar: guildAvatar,
        invite_link: guildInvite,
        ownerId: ownerId,
        side: side,
      });
    }

    // Get the newly created/updated regiment's ID
    const regimentId = regiment.id;

    // Find the user
    const user = await User.findOne({ where: { discordId: ownerId } });

    if (user) {
      // Update the user's regimentId column
      await User.update({ regimentId: regimentId }, { where: { discordId: ownerId } });

      // Get the user's roles
      let roles = await user.getRoles();

      // Check if role 2 is already present in the roles array
      const hasRole2 = roles.some(role => role.id === 2);

      // Add role 2 to the updated roles if it's not already present
      if (!hasRole2) {
        roles.push(2);
      }

      // Update the user's roles
      await user.setRoles(roles);

      return res.status(200).json({ regimentId: regimentId, message: "User roles updated successfully!" });
    }

    return res.status(200).json({ regimentId: regimentId, message: "Regiment created/updated successfully!" });
  } catch (error) {
    console.error("Error creating/updating regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




exports.removeUsersRegiment = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.getRoles().then(async (roles) => {
      const hasRole2 = roles.some(role => role.id === 2);

      if (hasRole2) {
        const updatedRoles = roles.filter(role => role.id !== 2);
        await user.setRoles(updatedRoles);
      }

      const updatedUser = await user.update({ regimentId: null });
      return res.status(200).json(updatedUser);
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.addGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const { steamId, nickname = "Steam User" } = req.body;

  if (!steamId) {
    return res.status(400).json({ error: "Missing steamId in request body" });
  }

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const existingGameId = await GameId.findOne({
      where: { steamId: steamId, nickname: nickname, regimentId: regimentId },
    });

    if (existingGameId) {
      existingGameId.steamId = steamId;
      existingGameId.nickname = nickname;
      existingGameId.regimentId = regimentId;
      
      existingGameId
        .save()
        .then((updatedGameId) => {
          res.status(200).json({ message: "Game ID already exists", gameId: updatedGameId });
        })
        .catch((err) => {
          console.error("Failed to update the game ID:", err);
          return res.status(500).json({ error: "Failed to update the game ID." });
        });
    } else {
      GameId.create({
        regimentId: regimentId,
        nickname: nickname,
        steamId: steamId,
      })
        .then((createdGameId) => {
          res.status(200).json({ message: "Game ID created successfully", gameId: createdGameId });
        })
        .catch((err) => {
          console.error("Failed to create the game ID:", err);
          return res.status(500).json({ error: "Failed to create the game ID." });
        });
    }

  } catch (error) {
    console.error("Error handling game ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



exports.removeGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const gameId = req.params.gameId;


  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const gameIdRecord = await GameId.findByPk(gameId);

    if (!gameIdRecord) {
      return res.status(404).json({ error: "Game ID not found" });
    }

    const deleted = await gameIdRecord.destroy();

    return res.status(200).json({ message: "Game ID deleted successfully", deleted });

  } catch (error) {
    console.error("Error deleting game ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



exports.findGameIdsByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const steamApiKey = process.env.STEAM_API_KEY;

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const gameIds = await GameId.findAll({
      where: { regimentId: regimentId },
    });

    const gameIdsWithUnbanCode = await Promise.all(gameIds.map(async gameId => {
      const steamId = gameId.steamId;

      let liveGameStats, liveSteamData;

      try {
        const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${steamId}`);
        liveGameStats = gameStatsResponse.data.playerstats.stats;
      } catch { }

      try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`);
        liveSteamData = response.data.response.players[0];
      } catch { }

      return {
        ...gameId.toJSON(),
        unbanCode: `Unban.User.SteamID ${steamId}`,
        ...(liveSteamData ? { liveSteamData } : {}),
        ...(liveGameStats ? { liveGameStats } : {}),
      };
    }));

    return res.status(200).json(gameIdsWithUnbanCode);

  } catch (error) {
    console.error("Error retrieving game IDs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}





exports.findRegimentBySteamId = async (req, res) => {
  const gameId = req.params.steamId;
  const steamApiKey = process.env.STEAM_API_KEY;

  try {
    const gameIdRecord = await GameId.findOne({ where: { steamId: gameId } });

    if (!gameIdRecord) {
      return res.status(404).json({ error: "Game ID not found" });
    }

    const regimentId = gameIdRecord.regimentId;
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${gameId}`);
    const liveGameStats = gameStatsResponse.data.playerstats.stats;

    // fetch player summary data from Steam API
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${gameId}`);
    const liveSteamData = response.data.response.players[0];

    const gameIdData = {
      ...gameIdRecord.dataValues,
      unbanCode: `Unban.User.SteamID ${gameId}`
    };

    const responseData = {
      ...regiment.dataValues,
      gameIdData,
      liveSteamData,
      liveGameStats,
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error retrieving regiment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.findGameIdsByGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const gameId = req.params.gameId;
  const steamApiKey = process.env.STEAM_API_KEY;
  
  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({ error: "Regiment not found" });
    }

    // Find the GameId record where gameId matches the req.params.gameId
    const gameIdRecord = await GameId.findOne({ where: { id: gameId } });

    if (!gameIdRecord) {
      return res.status(404).json({ error: "Game ID not found for the specified Regiment and Game ID" });
    }

    const steamId = gameIdRecord.steamId;

    const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${steamId}`);
    const liveGameStats = gameStatsResponse.data.playerstats.stats;

    // Fetch player summary data from Steam API
    const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`);
    const liveSteamData = response.data.response.players[0];

    const gameIdData = {
      ...gameIdRecord.dataValues,
      unbanCode: `Unban.User.SteamID ${steamId}`
    };

    const responseData = {
      ...regiment.dataValues,
      gameIdData,
      liveSteamData,
      liveGameStats,
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error("Error retrieving game IDs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
