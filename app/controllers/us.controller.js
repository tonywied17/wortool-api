/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\us.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:52:34 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Us = db.us;

/**
 * Retrieve all us schedules from the database.
 * This function is used to retrieve all us schedules from the database.
 * @param {*} req 
 * @param {*} res 
 */
exports.findAll = (req, res) => {
  Us.findAll()
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
 * Retrieve all us schedules from the database by day.
 * This function is used to retrieve all us schedules from the database by day.
 * 
 * @param {*} req - request containing the day
 * @param {*} res - response containing the us schedules
 */
exports.findAllByDay = (req, res) => {
  Us.findAll({ where: { day: req.params.day } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving us day.",
      });
    });
};

/**
 * Retrieve a single us schedule with a day.
 * This function is used to retrieve a single us schedule with a day.
 * 
 * @param {*} req - request containing the day
 * @param {*} res - response containing the us schedule
 */
exports.findOne = (req, res) => {
  const day = req.params.day;

  Us.findOne(day)
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
