/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\regiment.controller.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp07407\public_html\api.tonewebdesign.com\pa-api\app\controllers
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Sat August 5th 2023 9:50:36 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Regiment = db.regiment;
const User = db.user;
const GameId = db.gameid;
const RegSchedule = db.regSchedule;
const axios = require("axios");

/**
 * Retrieve all regiments from the database.
 * This function is used to retrieve all regiments from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the regiments
 * @returns - regiments
 */
exports.findAll = async (req, res) => {
  try {

    const regiments = await Regiment.findAll();

    return res.status(200).json(regiments);
  } catch (error) {
    // Handle any errors
    console.error("Error retrieving regiments:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Retrieve a single regiment with an id.
 * This function is used to retrieve a single regiment with an id.
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response containing the regiment
 * @returns - regiment 
 */
exports.findOne = async (req, res) => {
  const id = req.params.regimentId;

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    return res.status(200).json(regiment);
  } catch (error) {
    console.error("Error retrieving regiment:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Retrieve a single regiment with an id.
 * This function is used to retrieve a single regiment with an id.
 * @param {*} req - request containing the id
 * @param {*} res - response containing the regiment
 * @returns - regiment
 */
exports.findUsersByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;

  try {
    const users = await User.findAll({
      where: {
        regimentId: regimentId,
      },
      attributes: {
        exclude: ['password']
      },
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
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Update a regiment by the id in the request
 * This function is used to update a regiment by the id in the request
 * 
 * @param {*} req - request containing the id and body
 * @param {*} res - response containing the updated regiment
 * @returns - updated regiment
 */
exports.update = async (req, res) => {
  const id = req.params.regimentId;

  console.log(req.body)

  try {
    const regiment = await Regiment.findByPk(id);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const updatedRegiment = await regiment.update(req.body);

    return res.status(200).json(updatedRegiment);
  } catch (error) {
    console.error("Error updating regiment:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Create a new regiment via discord bot
 * This function is used to create a new regiment
 * 
 * @param {*} req - request containing the body from a discord axios request
 * @param {*} res - response
 * @returns - message notifying the user that the regiment was created/updated successfully
 */
exports.createRegiment = async (req, res) => {
  const {
    guildId,
    guildName,
    guildAvatar,
    guildInvite,
    ownerId,
    side,
    memberCount
  } = req.body;
  try {
    let regiment = await Regiment.findOne({
      where: {
        guild_id: guildId
      }
    });

    if (regiment) {
      if (regiment.ownerId === ownerId) {
        regiment = await Regiment.update({
          regiment: guildName,
          guild_avatar: guildAvatar,
          invite_link: guildInvite,
          ownerId: ownerId,
          side: side,
          memberCount: memberCount,
        }, {
          where: {
            guild_id: guildId
          }
        });
      } else {
        return res.status(400).json({
          error: "Owner ID mismatch. You're not authorized to update this regiment."
        });
      }
    } else {
      regiment = await Regiment.create({
        guild_id: guildId,
        regiment: guildName,
        guild_avatar: guildAvatar,
        invite_link: guildInvite,
        ownerId: ownerId,
        side: side,
        memberCount: memberCount,
      });
    }

    const regimentId = regiment.id;
    const user = await User.findOne({
      where: {
        discordId: ownerId
      }
    });

    if (user) {
      await User.update({
        regimentId: regimentId
      }, {
        where: {
          discordId: ownerId
        }
      });

      let roles = await user.getRoles();
      const hasRole2 = roles.some(role => role.id === 2);

      if (!hasRole2) {
        roles.push(2);
      }

      await user.setRoles(roles);
      return res.status(200).json({
        regimentId: regimentId,
        message: "User roles updated successfully!"
      });
    }

    return res.status(200).json({
      regimentId: regimentId,
      message: "Regiment created/updated successfully!"
    });
  } catch (error) {
    console.error("Error creating/updating regiment:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Update memberCount for regiment guild
 * This function is used to update the memberCount for a regiment guild
 * @param {*} req - request containing the guildId and body
 * @param {*} res - response containing the updated regiment
 * @returns - updated regiment
 */
exports.updateMemberCount = async (req, res) => {
  const guildId = req.params.guildId;
  const {
    memberCount
  } = req.body;

  try {
    const regiment = await Regiment.findOne({
      where: {
        guild_id: guildId
      }
    });

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const updatedRegiment = await regiment.update({
      memberCount: memberCount
    });

    return res.status(200).json(updatedRegiment);
  } catch (error) {
    console.error("Error updating regiment:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}


/**
 * Delete a regiment with the specified id in the request
 * This function is used to delete a regiment with the specified id in the request
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response
 * @returns - message notifying the user that the regiment was deleted successfully
 */
exports.removeUsersRegiment = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    user.getRoles().then(async (roles) => {
      const hasRole2 = roles.some(role => role.id === 2);

      if (hasRole2) {
        const updatedRoles = roles.filter(role => role.id !== 2);
        await user.setRoles(updatedRoles);
      }

      const updatedUser = await user.update({
        regimentId: null
      });
      return res.status(200).json(updatedUser);
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Add a game ID to a regiment
 * This function is used to add a game ID to a regiment
 * ? Note: GameID refers to a SteamID of an individual player -- This is because I use the SteamID model for registered users (naming conventions are hard).
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const {
    steamId,
    nickname = "Steam User"
  } = req.body;

  if (!steamId) {
    return res.status(400).json({
      error: "Missing steamId in request body"
    });
  }

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const existingGameId = await GameId.findOne({
      where: {
        steamId: steamId,
        nickname: nickname,
        regimentId: regimentId
      },
    });

    if (existingGameId) {
      existingGameId.steamId = steamId;
      existingGameId.nickname = nickname;
      existingGameId.regimentId = regimentId;

      existingGameId
        .save()
        .then((updatedGameId) => {
          res.status(200).json({
            message: "Game ID already exists",
            gameId: updatedGameId
          });
        })
        .catch((err) => {
          console.error("Failed to update the game ID:", err);
          return res.status(500).json({
            error: "Failed to update the game ID."
          });
        });
    } else {
      GameId.create({
          regimentId: regimentId,
          nickname: nickname,
          steamId: steamId,
        })
        .then((createdGameId) => {
          res.status(200).json({
            message: "Game ID created successfully",
            gameId: createdGameId
          });
        })
        .catch((err) => {
          console.error("Failed to create the game ID:", err);
          return res.status(500).json({
            error: "Failed to create the game ID."
          });
        });
    }

  } catch (error) {
    console.error("Error handling game ID:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Remove a game ID from a regiment
 * This function is used to remove a game ID from a regiment
 * 
 * @param {*} req - request containing the regimentId and gameId
 * @param {*} res - response
 * @returns - message notifying the user that the game ID was deleted successfully
 */
exports.removeGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const gameId = req.params.gameId;

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const gameIdRecord = await GameId.findByPk(gameId);

    if (!gameIdRecord) {
      return res.status(404).json({
        error: "Game ID not found"
      });
    }

    const deleted = await gameIdRecord.destroy();

    return res.status(200).json({
      message: "Game ID deleted successfully",
      deleted
    });

  } catch (error) {
    console.error("Error deleting game ID:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve all game IDs for a regiment
 * This function is used to retrieve all game IDs for a regiment
 * 
 * @param {*} req - request containing the regimentId
 * @param {*} res - response
 * @returns - game IDs
 */
exports.findGameIdsByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const steamApiKey = process.env.STEAM_API_KEY;

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const gameIds = await GameId.findAll({
      where: {
        regimentId: regimentId
      },
    });

    const gameIdsWithUnbanCode = await Promise.all(gameIds.map(async gameId => {
      const steamId = gameId.steamId;

      let liveGameStats, liveSteamData;

      try {
        const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${steamId}`);
        liveGameStats = gameStatsResponse.data.playerstats.stats;
      } catch {}

      try {
        const response = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`);
        liveSteamData = response.data.response.players[0];
      } catch {}

      return {
        ...gameId.toJSON(),
        unbanCode: `Unban.User.SteamID ${steamId}`,
        ...(liveSteamData ? {
          liveSteamData
        } : {}),
        ...(liveGameStats ? {
          liveGameStats
        } : {}),
      };
    }));

    return res.status(200).json(gameIdsWithUnbanCode);

  } catch (error) {
    console.error("Error retrieving game IDs:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve a single regiment with a STEAM Id.
 * This function is used to retrieve a single regiment with a STEAM Id.
 * 
 * @param {*} req - request containing the STEAM Id
 * @param {*} res - response containing the regiment
 * @returns - regiment
 */
exports.findRegimentBySteamId = async (req, res) => {
  const gameId = req.params.steamId;
  const steamApiKey = process.env.STEAM_API_KEY;

  try {
    const gameIdRecord = await GameId.findOne({
      where: {
        steamId: gameId
      }
    });

    if (!gameIdRecord) {
      return res.status(404).json({
        error: "Game ID not found"
      });
    }

    const regimentId = gameIdRecord.regimentId;
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${gameId}`);
    const liveGameStats = gameStatsResponse.data.playerstats.stats;

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
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Retrieve a single regiment with a GAME Id.
 * This function is used to retrieve a single regiment with a GAME Id.
 * 
 * @param {*} req - request containing the GAME Id
 * @param {*} res - response containing the regiment
 * @returns - regiment
 */
exports.findGameIdsByGameId = async (req, res) => {
  const regimentId = req.params.regimentId;
  const gameId = req.params.gameId;
  const steamApiKey = process.env.STEAM_API_KEY;

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const gameIdRecord = await GameId.findOne({
      where: {
        id: gameId
      }
    });

    if (!gameIdRecord) {
      return res.status(404).json({
        error: "Game ID not found for the specified Regiment and Game ID"
      });
    }

    const steamId = gameIdRecord.steamId;

    const gameStatsResponse = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=424030&key=${steamApiKey}&steamid=${steamId}`);
    const liveGameStats = gameStatsResponse.data.playerstats.stats;

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
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve a schedule for a certain day
 * This function is used to retrieve a schedule for a certain day.
 * @param {*} req - request containing the regimentId and day
 * @param {*} res - response
 * @returns - schedule
 */
exports.findScheduleByDay = async (req, res) => {
  const regimentId = req.params.regimentId;
  const day = req.body.day;

  try{
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const schedule = await RegSchedule.findAll({
      where: {
        regimentId: regimentId,
        day: day
      },
    });

    return res.status(200).json(schedule);

  } catch (error) {
    console.error("Error retrieving schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve all schedules for a regiment
 * This function is used to retrieve all schedules for a regiment
 * @param {*} req - request containing the regimentId
 * @param {*} res - response
 * @returns - schedules
 */
exports.findSchedulesByRegimentId = async (req, res) => {
  const regimentId = req.params.regimentId;

  try{
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const schedule = await RegSchedule.findAll({
      where: {
        regimentId: regimentId,
      },
    });

    return res.status(200).json(schedule);

  } catch (error) {
    console.error("Error retrieving schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve a schedule for a certain region
 * This function is used to retrieve a schedule for a certain region.
 * @param {*} req - request containing the regimentId and region
 * @param {*} res - response
 * @returns - schedule
 */
exports.findRegimentByRegionTz = async (req, res) => {
  const regimentId = req.params.regimentId;
  const region = req.body.region;

  try{
    const regiment = await Regiment.findOne({
      where: {
        id: regimentId,
      },
    });

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const schedule = await RegSchedule.findAll({
      where: {
        region_tz: region,
      },
    });

    return res.status(200).json(schedule);

  } catch (error) {
    console.error("Error retrieving schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Retrieve a schedule by regiment id and schedule name
 * This function is used to retrieve a schedule by regiment id and schedule name
 * @param {*} req - request containing the regimentId and schedule_name
 * @param {*} res - response
 * @returns - schedule
 */
exports.findRegimentByScheduleName = async (req, res) => {
  const regimentId = req.params.regimentId;
  const schedule_name = req.body.schedule_name;

  try{
    const regiment = await Regiment.findOne({
      where: {
        id: regimentId,
      },
    });

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const schedule = await RegSchedule.findAll({
      where: {
        schedule_name: schedule_name,
      },
    });

    return res.status(200).json(schedule);

  } catch (error) {
    console.error("Error retrieving schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Create a schedule for a regiment
 * This function is used to create a schedule for a regiment
 * @param {*} req - request containing the regimentId and body
 * @param {*} res - response
 * @returns - message notifying the user that the schedule was created successfully
 */
exports.createSchedule = async (req, res) => {
  const regimentId = req.params.regimentId;
  const {
    schedule_name,
    region,
    day,
    time,
    event_type,
    event_name
  } = req.body;

  if (!day) {
    return res.status(400).json({
      error: "Missing day in request body"
    });
  }

  if (!time) {
    return res.status(400).json({
      error: "Missing time in request body"
    });
  }

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    RegSchedule.create({
        schedule_name: schedule_name,
        region_tz: region,
        regimentId: regimentId,
        day: day,
        time: time,
        event_type: event_type,
        event_name: event_name,
      })
      .then((createdSchedule) => {
        res.status(200).json({
          message: "Schedule created successfully",
          schedule: createdSchedule
        });
      })
      .catch((err) => {
        console.error("Failed to create the schedule:", err);
        return res.status(500).json({
          error: "Failed to create the schedule."
        });
      });

  } catch (error) {
    console.error("Error handling schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * Delete a schedule from a regiment
 * This function is used to delete a schedule from a regiment
 * @param {*} req - request containing the regimentId and scheduleId
 * @param {*} res - response
 * @returns - message notifying the user that the schedule was deleted successfully
 */
exports.removeSchedule = async (req, res) => {
  const regimentId = req.params.regimentId;
  const scheduleId = req.params.scheduleId;

  try {
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    const schedule = await RegSchedule.findByPk(scheduleId);

    if (!schedule) {
      return res.status(404).json({
        error: "Schedule not found"
      });
    }

    const deleted = await schedule.destroy();

    return res.status(200).json({
      message: "Schedule deleted successfully",
      deleted
    });

  } catch (error) {
    console.error("Error deleting schedule:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

// update discord avatar OR guild name
exports.updateDiscord = async (req, res) => {
  const {
    guildId,
    guildName,
    guildAvatar
  } = req.body;

  try {
    const regiment = await Regiment.findOne({
      where: {
        guild_id: guildId
      }
    });

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found"
      });
    }

    if (guildName) {
      regiment.regiment = guildName;
    }

    if (guildAvatar) {
      regiment.guild_avatar = guildAvatar;
    }

    const updatedRegiment = await regiment.save();

    return res.status(200).json(updatedRegiment);
  } catch (error) {
    console.error("Error updating regiment:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}
