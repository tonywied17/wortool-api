/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\regiment.controller.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp44236\wortool-api\app\controllers
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon January 6th 2025 9:11:56 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Regiment = db.Regiment;
const DiscordGuild = db.DiscordGuild;
const User = db.User;
const GameId = db.SteamUser;
const RegSchedule = db.RegSchedule;
const axios = require("axios");
const uploadFile = require("../middleware/upload").uploadFileMiddleware;
const uploadCover = require("../middleware/upload").uploadCoverMiddleware;
const path = require("path");
const __basedir = path.resolve();
const fs = require("fs");

// ! Basic Regiment Functions

/**
 * Retrieve all regiments from the database.
 * This function is used to retrieve all regiments from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the regiments
 * @returns - regiments
 */
// The updated findAll method
exports.findAll = async (req, res) => {
  try {
    // Assuming verifyRegiment is called earlier in the middleware stack
    const regiments = await Regiment.findAll({
      attributes: {
        exclude: ['webhook', 'webhook_channel', 'webhook_mention']
      }
    });

    return res.status(200).json(regiments);
  } catch (error) {
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
    const regiment = await Regiment.findByPk(id, {
      attributes: {
        exclude: ['webhook', 'webhook_channel', 'webhook_mention']
      }
    });

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
 * Retrieve a user's regiment with the specified id in the request
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
      include: [{
        model: Regiment,
        as: 'wor_Regiment',
      }]
    });

    const usersWithRolesAndGuildId = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const guildId = user.wor_Regiment ? user.wor_Regiment.guild_id : 'No Regiment';

      const roles = await user.getWor_Roles();
      let authorities = [];

      for (let j = 0; j < roles.length; j++) {
        authorities.push("ROLE_" + roles[j].name.toUpperCase());
      }

      usersWithRolesAndGuildId.push({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
        discordId: user.discordId,
        regimentId: user.regimentId,
        roles: authorities,
        guildId: guildId, 
      });
    }

    return res.status(200).json(usersWithRolesAndGuildId);
  } catch (err) {
    console.error("Error retrieving regiment:", err);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

/**
 * Delete a user's regiment with the specified id in the request
 * This function is used to delete a user's regiment with the specified id in the request
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

    user.getWor_Roles().then(async (roles) => {
      const hasRole2 = roles.some(role => role.id === 2);

      if (hasRole2) {
        const updatedRoles = roles.filter(role => role.id !== 2);
        await user.setWor_Roles(updatedRoles);
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


// ! Steam Stats Functions

/**
 * Add a game ID to a regiment
 * This function is used to add a game ID to a regiment
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


// ! Schedule Functions

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
 * Retrieve a schedule for a certain day
 * This function is used to retrieve a schedule for a certain day.
 * @param {*} req - request containing the regimentId and day
 * @param {*} res - response
 * @returns - schedule
 */
exports.findScheduleByDayGuildId = async (req, res) => {
  const guildId = req.params.guildId;
  const today = req.body.day;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowName = tomorrow.toLocaleString('en-US', {
    weekday: 'long',
  });

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

    // Fetch schedules for both today and tomorrow
    const todaySchedule = await RegSchedule.findAll({
      where: {
        regimentId: regiment.id,
        day: today
      }
    });

    const tomorrowSchedule = await RegSchedule.findAll({
      where: {
        regimentId: regiment.id,
        day: tomorrowName
      }
    });

    const combinedSchedule = todaySchedule.concat(tomorrowSchedule);

    return res.status(200).json(combinedSchedule);

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


// ! Media File Functions

/**
 * Upload a media file to the server
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.upload = async (req, res) => {

  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 10MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
}

/**
 * Get a regiment's media files
 * @param {*} req 
 * @param {*} res 
 */
exports.getListFiles = (req, res) => {
  const baseUrl = `https://api.wortool.com/v2/regiments/${req.params.regimentId}/files/`;
  const directoryPath = path.join(__basedir, `resources/${req.params.regimentId}/static/assets/uploads/`);

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(200).send([]);
    } else {
      let fileInfos = [];

      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        if (!fs.statSync(filePath).isDirectory() && path.dirname(file) !== 'cover') {
          fileInfos.push({
            name: file,
            url: baseUrl + file,
          });
        }
      });

      res.status(200).send(fileInfos);
    }
  });
};

/**
 * Upload a regiment's cover photo to the server
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.uploadCover = async (req, res) => {
  const regimentId = req.params.regimentId;
  try {
    await uploadCover(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Update regiment cover model
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found",
      });
    }

    const coverUrl = `https://api.wortool.com/v2/regiments/${req.params.regimentId}/files/cover/${req.file.filename}`;

    const updatedRegiment = await regiment.update({
      cover_photo: coverUrl,
    });

    return res.status(200).json(updatedRegiment); // Send the updated regiment as a response
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 10MB!",
      });
    }

    return res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

/**
 * Get a regiment's cover photos
 * @param {*} req 
 * @param {*} res 
 */
exports.getCoverPhoto = (req, res) => {
  const baseUrl = `https://api.wortool.com/v2/regiments/${req.params.regimentId}/files/cover/`;
  const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/cover/`;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(200).send([]);
    } else {
      let fileInfos = [];

      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });

      res.status(200).send(fileInfos);
    }
  });
};

/**
 * Download/GET a regiment's media file from the server
 * @param {*} req 
 * @param {*} res 
 */
exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/`;

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

/**
 * Download/GET a regiment's cover photo from the server
 * @param {*} req 
 * @param {*} res 
 */
exports.downloadCover = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/cover/`;

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

/**
 * Remove a regiment's media file from the server
 * @param {*} req 
 * @param {*} res 
 */
exports.remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/`;

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

/**
 * Remove a regiment's cover photo from the server
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.removeCover = async (req, res) => {
  try {
    const fileName = req.params.name;
    const regimentId = req.params.regimentId;
    const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/cover/`;
    const regiment = await Regiment.findByPk(regimentId);

    if (!regiment) {
      return res.status(404).json({
        error: "Regiment not found",
      });
    }

    const coverUrl = null;

    const updatedRegiment = await regiment.update({
      cover_photo: coverUrl,
    });

    // Send the response before attempting to delete the file
    res.status(200).json(updatedRegiment);

    // Delete the file
    fs.unlink(directoryPath + fileName, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
        res.status(500).send({
          message: "Could not delete the file. " + err,
        });
      } else {
        console.log("File is deleted.");
      }
    });
  } catch (error) {
    console.error("Error in removeCover:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Remove a regiment's media file from the server (synchronous)
 * @param {*} req 
 * @param {*} res 
 */
exports.removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + `/resources/${req.params.regimentId}/static/assets/uploads/`;

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};


// ! Discord Bot and Discord Related Functions

/**
 * Create a new regiment via discord bot
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
    memberCount,
    members,
    prefix
  } = req.body;

  console.log(members)

  try {
    let regiment = await Regiment.findOne({
      where: {
        guild_id: guildId
      }
    });

    if (regiment) {
      if (regiment.ownerId === ownerId) {
        await Regiment.update({
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
        regiment = await Regiment.findOne({ where: { guild_id: guildId } });
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

    const guild = await DiscordGuild.findOne({
      where: {
        regimentId: regimentId
      }
    });
    
    if (!guild) {
      await DiscordGuild.create({
        name: guildName,
        guildId: guildId,
        regimentId: regimentId,
        icon: guildAvatar,
        prefix: prefix,
      });
    } else {
      await DiscordGuild.update({
        name: guildName,
        guildId: guildId,
        regimentId: regimentId,
        icon: guildAvatar,
        prefix: prefix,
      }, {
        where: {
          regimentId: regimentId
        }
      });
    }


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

      let roles = await user.getWor_Roles();
      const hasRole2 = roles.some(role => role.id === 2);

      if (!hasRole2) {
        roles.push(2);
      }
      
      await user.setWor_Roles(roles);

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
 * Update a regiment by the id in the request
 * This function is used to update a regiment's profile data by the id in the request
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
 * Find guild data by the discord guild id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.findDiscordGuild = async (req, res) => {
  const guildId = req.params.guildId;

  try {
    const guild = await DiscordGuild.findOne({
      where: {
        guildId: guildId
      }
    });

    if (!guild) {
      return res.status(404).json({
        error: "Discord Guild not found"
      });
    }

    return res.status(200).json(guild);

  } catch (error) {
    console.error("Error retrieving discord guild:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

/**
 * ! Check if Ready for Deletion
 * Update a regiment prefix (was used for message commands)
 * This function was used to update a regiment prefix
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updatePrefix = async (req, res) => {
  const guildId = req.params.guildId;
  const prefix = req.body.prefix;

  try {
    const guild = await DiscordGuild.findOne({
      where: {
        guildId: guildId
      }
    });

    if (!guild) {
      return res.status(404).json({
        error: "Discord Guild not found"
      });
    }
    
    const updatedGuild = await guild.update({
      prefix: prefix
    });

    return res.status(200).json(updatedGuild);

  } catch (error) {
    console.error("Error updating prefix:", error);
    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}

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
 * Update a regiment's discord guild data
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
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

/**
 * Handle roleCreated event from Discord Bot
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.newGuildRole = async (req, res) => {
    const { guildId } = req.params;
    const { roleId, roleName } = req.body;

    try {
        const regiment = await db.Regiment.findOne({ where: { guild_id: guildId } });
        if (!regiment) return res.status(404).send({ message: "Regiment not found." });

        const newRole = await db.GuildRole.create({
            roleId,
            roleName,
            guildId: regiment.guild_id,
        });

        return res.status(201).send(newRole);
    } catch (error) {
        console.error("Error creating new guild role:", error);
        return res.status(500).send({ message: "Error creating new guild role" });
    }
};

/**
 * Handle chunk roles from guildCreate event from Discord Bot
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.newGuildRoles = async (req, res) => {
  const { guildId } = req.params;
  const roles = req.body.roles; 

  if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).send({ message: "Invalid roles data provided." });
  }

  try {
      const regiment = await db.Regiment.findOne({ where: { guild_id: guildId } });
      if (!regiment) return res.status(404).send({ message: "Regiment not found." });

      const rolesData = roles.map(role => ({
          roleId: role.id,
          roleName: role.name,
          guildId: guildId
      }));

      const createdRoles = await db.GuildRole.bulkCreate(rolesData, {
          updateOnDuplicate: ['roleName'], 
      });

      return res.status(201).send(createdRoles);
  } catch (error) {
      console.error("Error creating new guild roles:", error);
      return res.status(500).send({ message: "Error creating new guild roles" });
  }
};

/**
 * Get a regiment's Discord roles
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getGuildRoles = async (req, res) => {
  const { regimentId } = req.params;

  try {
      const regiment = await db.Regiment.findByPk(regimentId);
      if (!regiment) {
          return res.status(404).send({ message: "Regiment not found." });
      }

      const roles = await db.GuildRole.findAll({
          where: { guildId: regiment.guild_id }
      });

      if (!roles || roles.length === 0) {
          return res.status(404).send({ message: "No roles found for this guild." });
      }

      return res.status(200).send(roles);
  } catch (error) {
      console.error("Error finding guild roles:", error);
      return res.status(500).send({ message: "Error retrieving guild roles" });
  }
};

/**
 * Delete a regiment's Discord role
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteGuildRole = async (req, res) => {
  const { guildId } = req.params;
  const { roleId } = req.body;

  try {
      const result = await db.GuildRole.destroy({
          where: { guildId, roleId }
      });

      if (result === 0) return res.status(404).send({ message: "Role not found or already deleted." });

      return res.status(200).send({ message: "Role deleted successfully." });
  } catch (error) {
      console.error("Error deleting guild role:", error);
      return res.status(500).send({ message: "Error deleting guild role" });
  }
};

/**
 * Handle roleUpdate event from Discord Bot
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateGuildRole = async (req, res) => {
  const { guildId } = req.params;
  const { roleId, newRoleName } = req.body;

  try {
      const role = await db.GuildRole.findOne({
          where: {
              roleId: roleId,
              guildId: guildId,
          }
      });

      if (!role) {
          return res.status(404).send({ message: "Role not found." });
      }

      role.roleName = newRoleName;
      await role.save();
      return res.status(200).send({
          message: "Role updated successfully.",
          role: {
              roleId: role.roleId,
              roleName: role.roleName,
              guildId: role.guildId
          }
      });
  } catch (error) {
      console.error("Error updating guild role:", error);
      return res.status(500).send({ message: "Error updating guild role" });
  }
};

/**
 * Handle channelCreate event from Discord Bot
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.newGuildChannel = async (req, res) => {
  const { guildId } = req.params;
  const { channelId, channelName, channelType } = req.body;

  try {
      const regiment = await db.Regiment.findOne({ where: { guild_id: guildId } });
      if (!regiment) return res.status(404).send({ message: "Regiment not found." });

      const newChannel = await db.GuildChannel.create({
          channelId,
          channelName,
          channelType,
          guildId: regiment.guild_id,
      });

      return res.status(201).send(newChannel);
  } catch (error) {
      console.error("Error creating new guild channel:", error);
      return res.status(500).send({ message: "Error creating new guild channel" });
  }
};

/**
 * Handle chunk channels from guildCreate event from Discord Bot
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.newGuildChannels = async (req, res) => {
  const { guildId } = req.params;
  const channels = req.body.channels; 

  if (!Array.isArray(channels) || channels.length === 0) {
      return res.status(400).send({ message: "Invalid channels data provided." });
  }

  try {
      const regiment = await db.Regiment.findOne({ where: { guild_id: guildId } });
      if (!regiment) return res.status(404).send({ message: "Regiment not found." });

      const channelsData = channels.map(channel => ({
          channelId: channel.id,
          channelName: channel.name,
          channelType: channel.type,
          guildId: guildId
      }));

      const createdChannels = await db.GuildChannel.bulkCreate(channelsData, {
          updateOnDuplicate: ['channelName'], 
      });

      return res.status(201).send(createdChannels);
  } catch (error) {
      console.error("Error creating new guild channels:", error);
      return res.status(500).send({ message: "Error creating new guild channels" });
  }
};

/**
 * Get a regiment's Discord channels
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getGuildChannels = async (req, res) => {
  const { regimentId } = req.params;

  try {
      const regiment = await db.Regiment.findByPk(regimentId);
      if (!regiment) {
          return res.status(404).send({ message: "Regiment not found." });
      }

      const channels = await db.GuildChannel.findAll({
          where: { guildId: regiment.guild_id }
      });

      if (!channels || channels.length === 0) {
          return res.status(404).send({ message: "No channels found for this guild." });
      }

      return res.status(200).send(channels);
  } catch (error) {
      console.error("Error finding guild channels:", error);
      return res.status(500).send({ message: "Error retrieving guild channels" });
  }
};

exports.findWebhooksByRegimentId = async (req, res) => {
  const id = req.params.regimentId;

  try {
    const regiment = await Regiment.findByPk(id, {
      attributes: ['webhook', 'webhook_channel', 'webhook_mention'] // Only include these three fields
    });

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
 * Delete a regiment's Discord channel
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteGuildChannel = async (req, res) => {
  const { guildId } = req.params;
  const { channelId } = req.body;

  try {
      const result = await db.GuildChannel.destroy({
          where: { guildId, channelId }
      });

      if (result === 0) return res.status(404).send({ message: "Channel not found or already deleted." });

      return res.status(200).send({ message: "Channel deleted successfully." });
  } catch (error) {
      console.error("Error deleting guild channel:", error);
      return res.status(500).send({ message: "Error deleting guild channel" });
  }
};

/**
 * Update a regiment's Discord channel
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateGuildChannel = async (req, res) => {
  const { guildId } = req.params;
  const { channelId, newChannelName, channelType } = req.body;

  try {
      let channel = await db.GuildChannel.findOne({
          where: {
              channelId: channelId,
              guildId: guildId,
          }
      });

      if (!channel) {
          channel = await db.GuildChannel.create({
              channelId: channelId,
              guildId: guildId,
              channelName: newChannelName,
              channelType: channelType
          });
          return res.status(201).send({
              message: "Channel created successfully.",
              channel: {
                  channelId: channel.channelId,
                  channelName: channel.channelName,
                  channelType: channel.channelType,
                  guildId: channel.guildId
              }
          });
      }

      channel.channelName = newChannelName;
      channel.channelType = channelType;
      await channel.save();

      return res.status(200).send({
          message: "Channel updated successfully.",
          channel: {
              channelId: channel.channelId,
              channelName: channel.channelName,
              channelType: channel.channelType,
              guildId: channel.guildId
          }
      });
  } catch (error) {
      console.error("Error updating or creating guild channel:", error);
      return res.status(500).send({ message: "Error updating or creating guild channel" });
  }
};
