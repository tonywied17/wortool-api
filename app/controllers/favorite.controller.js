/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\favorite.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:04:34 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Favorite = db.Favorite;

/**
 * Find all favorites for a specific user and map
 * This function is used to determine if a user has favorited a map
 *
 * @param {*} req - request containing the userId and mapId
 * @param {*} res - response containing the favorites
 */
exports.findFavoritesByUserAndMap = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;

  Favorite.findAll({
    where: {
      userId: userId,
      mapId: mapId,
    },
  })
    .then((favorites) => {
      res.send(favorites);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving favorites.",
      });
    });
};

/**
 * Create or update a favorite
 * This function is used to create or update a favorite
 *
 * @param {*} req - request containing the userId, mapId, and type
 * @param {*} res - response containing the favorite
 */
exports.createOrUpdateFavorite = (req, res) => {
  const route = req.body.route;
  const userId = req.params.userId;
  const mapId = req.params.mapId;
  const type = req.body.type;

  Favorite.findOne({
    where: {
      userId: userId,
      mapId: mapId,
    },
  })
    .then((favorite) => {
      if (favorite) {
        console.log("existing favorite: " + favorite);
        favorite.favorite = type;
        favorite
          .save()
          .then((updatedFavorite) => {
            res.send(updatedFavorite);
          })
          .catch((err) => {
            res.status(500).send({
              message: "Failed to update the favorite.",
            });
          });
      } else {
        Favorite.create({
          route: route,
          userId: userId,
          mapId: mapId,
          type: type,
        })
          .then((newFavorite) => {
            res.send(newFavorite);
          })
          .catch((err) => {
            res.status(500).send({
              message: "Failed to create the favorite.",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Failed to find the favorite.",
      });
    });
};

/**
 * Find all favorites for a specific user
 * This function is used to determine if a user has favorited a map
 *
 * @param {*} req - request containing the userId
 * @param {*} res - response containing the favorites
 */
exports.findFavoritesByUser = (req, res) => {
  const userId = req.params.userId;

  Favorite.findAll({
    where: {
      userId: userId,
    },
  })
    .then((favorites) => {
      res.send(favorites);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving favorites.",
      });
    });
};

/**
 * Find all favorites for a specific map
 * This function is used to determine if a map has been favorited
 *
 * @param {*} req - request containing the mapId
 * @param {*} res - response containing the favorites
 */
exports.findFavoritesByMap = (req, res) => {
  const mapId = req.params.mapId;

  Favorite.findAll({
    where: {
      mapId: mapId,
      type: "map",
    },
  })
    .then((favorites) => {
      res.send(favorites);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving favorites.",
      });
    });
};

/**
 * Delete a favorite
 * This function is used to delete a favorite
 *
 * @param {*} req - request containing the userId and mapId
 * @param {*} res - response containing the message
 */
exports.deleteFavorite = (req, res) => {
  const userId = req.params.userId;
  const mapId = req.params.mapId;

  Favorite.destroy({
    where: {
      userId: userId,
      mapId: mapId,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Favorite was deleted successfully.",
        });
      } else {
        res.send({
          message: `Cannot delete Favorite with userId=${userId} and mapId=${mapId}. Maybe Favorite was not found.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          "Could not delete Favorite with userId=" +
          userId +
          " and mapId=" +
          mapId,
      });
    });
};
