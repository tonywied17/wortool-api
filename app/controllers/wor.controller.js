/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\wor.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Saturday July 15th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:31:11 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Recap = db.Recap;

/**
 * Retrieve all recaps from the database.
 * This function is used to retrieve all recaps from the database.
 *
 * @param {*} req - request
 * @param {*} res - response containing the recaps
 */
exports.findAll = (req, res) => {
  Recap.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving recaps.",
      });
    });
};

/**
 * Store a recap in the database.
 * This function is used to store a recap in the database.
 * ? This is being used to test post-game recap data from wor servers
 *
 * @param {*} req - request
 * @param {*} res - response containing the recap
 */
exports.storeRecap = (req, res) => {
  let jsonData = req.body;

  const getWinnerString = (winner) => {
    switch (winner) {
      case 0:
        return "DRAW";
      case 1:
        return "USA";
      case 2:
        return "CSA";
      default:
        return "Unknown Result";
    }
  };

  const recapData = {
    serverName: jsonData.ServerInformation.ServerName,
    players: jsonData.Participants.Players,
    map: jsonData.MatchInformation.Map,
    gameMode: jsonData.MatchInformation.GameMode,
    area: jsonData.MatchInformation.Area,
    winner: getWinnerString(jsonData.MatchInformation.Winner),
    duration: jsonData.MatchInformation.Duration,
    startTime: jsonData.MatchInformation.StartTime,
    endTime: jsonData.MatchInformation.EndTime,
    usaInFormation: jsonData.Casualties.USA.InFormation,
    usaSkirmishing: jsonData.Casualties.USA.Skirmishing,
    usaOutOfLine: jsonData.Casualties.USA.OutOfLine,
    csaInFormation: jsonData.Casualties.CSA.InFormation,
    csaSkirmishing: jsonData.Casualties.CSA.Skirmishing,
    csaOutOfLine: jsonData.Casualties.CSA.OutOfLine,
  };

  Recap.create(recapData)
    .then((recap) => {
      console.log("Recap created:", recap);
    })
    .catch((error) => {
      console.error("Error creating recap:", error);
    });

  res.json(recapData);
};
