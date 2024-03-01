/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\middleware\authJwt.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:52:56 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;
require("dotenv").config({
  path: "/home/paarmy/envs/wor/.env"
});

/**
 * Verify Token
 * This function is used to verify the token
 *
 * @param {*} req - request
 * @param {*} res - boolean based on moderator access
 * @param {*} next
 */
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    if (req.params.userId && decoded.id == req.params.userId) {
      console.log("PARAMS: " + req.params.userId + " " + decoded.id);
      req.body.userId = decoded.id;
      next();
      return;
    }

    if (req.body.userId && decoded.id == req.body.userId) {
      console.log("BODY: " + req.body.userId + " " + decoded.id);
      req.body.userId = decoded.id;
      next();
      return;
    }

    return res.status(401).send({
      message: "Unauthorized!",
    });
  });
};

/**
 * Verify Admin
 * This function is used to verify the admin
 * @param {*} req - request
 * @param {*} res - boolean based on admin access
 * @returns - boolean
 */
isAdmin = (req, res, next) => {
  User.findByPk(req.body.userId).then((user) => {
    user.getWor_Roles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Admin Role!",
      });
      return;
    });
  });
};

/**
 * Verify Moderator
 * This function is used to verify the moderator
 *
 * @param {*} req - request
 * @param {*} res - boolean based on moderator access
 */
isModerator = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    User.findByPk(req.body.userId)
      .then((user) => {
        user.getWor_Roles().then((roles) => {
          let isModerator = false;

          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
              isModerator = true;
              break;
            }
          }

          if (!isModerator) {
            return res.status(403).send({
              message: "Require Moderator Role!",
            });
          }

          if (
            req.body.regimentId &&
            decoded.regimentId == req.body.regimentId
          ) {
            req.body.regimentId = decoded.regimentId;
            next();
          } else {
            return res.status(401).send({
              message: "Unauthorized!",
            });
          }
        });
      })
      .catch((err) => {
        return res.status(500).send({
          message: "Internal Server Error",
          error: err,
        });
      });
  });
};

/**
 * Verify Moderator or Admin
 * This function is used to verify the moderator or admin
 *
 * @param {*} req - request
 * @param {*} res - boolean based on moderator or admin access
 */
isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.body.userId).then((user) => {
    user.getWor_Roles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(403).send({
        message: "Require Moderator or Admin Role!",
      });
    });
  });
};

/**
 * Check Bearer Token
 * This function is used to check the bearer token
 * @param {*} req - request
 * @param {*} res - boolean based on bearer token
 * @returns - boolean
 */
checkBearerToken = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res
      .status(401)
      .json({
        message: "Unauthorized. Bearer token missing."
      });
  }
  const token = authorizationHeader.replace("Bearer ", "");
  if (token !== process.env.AUTH_SECRET) {
    return res
      .status(403)
      .json({
        message: "Forbidden. Invalid Bearer token."
      });
  }
  next();
  return;
};

/**
 * Verify Regiment
 * This function is used to verify the regiment
 * @param {*} req - request
 * @param {*} res - boolean based on regiment
 * @returns - boolean
 */
verifyRegiment = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }

    if (req.params.regimentId && decoded.regimentId == req.params.regimentId) {
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    if (req.body.regimentId && decoded.regimentId == req.body.regimentId) {
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    return res.status(401).send({
      message: "Unauthorized!",
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  verifyRegiment: verifyRegiment,
  checkBearerToken: checkBearerToken,
};
module.exports = authJwt;