/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\steamid.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:51:46 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const SteamID = db.steamid;

/**
 * Retrieve all SteamIDs from the database.
 * This function is used to retrieve all SteamIDs from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the SteamIDs
 */
exports.findAll = (req, res) => {
  SteamID.findAll()
    .then((steamids) => {
      res.send(steamids);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

/**
 * Retrieve a single SteamID with an id.
 * This function is used to retrieve a single SteamID with an id.
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response containing the SteamID
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  SteamID.findByPk(id)
    .then((steamid) => {
      res.send(steamid);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving SteamID with id=" + id,
      });
    });
};

/**
 * Create or Update a SteamID by the id in the request
 * This function is used to create or update a SteamID by the id in the request
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.createOrUpdate = (req, res) => {
  const steamId = req.params.steamId;
  const name = req.body.name;
  const idSteam = req.body.idSteam;
  const steamid = {
    name: name,
    idSteam: idSteam,
  };
  SteamID.upsert(steamid, { where: { id: steamId } })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "SteamID was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update SteamID with id=${steamId}. Maybe SteamID was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating SteamID with id=" + steamId,
      });
    });
};

/**
 * Delete a SteamID with the specified id in the request
 * This function is used to delete a SteamID with the specified id in the request
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response containing the message
 */
exports.delete = (req, res) => {
  const steamId = req.params.steamId;

  SteamID.destroy({
    where: { id: steamId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "SteamID was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete SteamID with id=${steamId}. Maybe SteamID was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete SteamID with id=" + steamId,
      });
    });
};
