/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\gallery.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:39:32 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */


const db = require("../models");
const Gallery = db.gallery;

/**
 * Retrieve all gallery items from the database.
 * This function is used to retrieve all gallery items from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the gallery items
 */
exports.findAll = (req, res) => {

  Gallery.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving gallery items."
      });
    });
};

/**
 * Retrieve a single gallery item with an id.
 * This function is used to retrieve a single gallery item with an id.
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response containing the gallery item
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Gallery.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find gallery item with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving gallery item with id=" + id
        });
      });
  };



