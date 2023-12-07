/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\eu.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:32:43 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Eu = db.eu;

/**
 * Create and Save a new item
 * This function will create a new item based on the request body
 * @param {*} req - request
 * @param {*} res - response
 */
exports.findAll = (req, res) => {
  Eu.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving items.",
      });
    });
};

/**
 * Find a single item with an id
 * This function will find a single item based on the request id
 * @param {*} req - request containing the day
 * @param {*} res - response
 */
exports.findAllByDay = (req, res) => {
  Eu.findAll({
      where: {
        day: req.params.day
      }
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving eu day.",
      });
    });
};

/**
 * Find a single item with an id
 * This function will find a single item based on the request id
 * @param {*} req - request containing the day
 * @param {*} res - response
 */
exports.findOne = (req, res) => {
  const day = req.params.day;

  Eu.findOne(day)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find item with day=${day}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving item with day=" + day,
      });
    });
};