/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\score.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:50:28 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Score = db.score;

/**
 * Retrieve all scores from the database.
 * This function is used to retrieve all scores from the database.
 * @param {*} req - request
 * @param {*} res - response containing the scores
 */
exports.findAll = (req, res) => {
  Score.findAll({
    order: [["score", "DESC"]],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving items.",
      });
    });
};
