/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\muster.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:41:04 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Muster = db.muster;

/**
 * Retrieve all muster items from the database.
 * This function is used to retrieve all muster items from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the muster items
 */
exports.findAll = (req, res) => {
  Muster.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving muster items.",
      });
    });
};

/**
 * Retrieve a single muster item with an id.
 * @param {*} req - request containing the id
 * @param {*} res - response containing the muster item
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  Muster.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find muster item with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving muster item with id=" + id,
      });
    });
};
