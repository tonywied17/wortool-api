/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\middleware\authJwt.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp22403\public_html\api.wortool.com\wor-api\app\middleware
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu February 22nd 2024 8:38:13 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.User;
require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });

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

    console.log(decoded.id + " " + req.params.userId);
    console.log(decoded.id + " " + req.body.userId);

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
 * @param {*} next
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

    console.log(decoded.regimentId + " " + req.body.regimentId);
    console.log(decoded.id + " " + req.body.userId);

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
            console.log(
              "Regiment ID: " + req.body.regimentId + " " + decoded.regimentId
            );
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
 * @param {*} next
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

checkBearerToken = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Unauthorized. Bearer token missing.' });
  }

  const token = authorizationHeader.replace('Bearer ', '');

  if (token !== process.env.AUTH_SECRET) {
    return res.status(403).json({ message: 'Forbidden. Invalid Bearer token.' });
  }

  console.log(token + " = " + process.env.AUTH_SECRET + " TOKEN MATCHED!!!!!!!!!!!!!!!!")
  // If the token is valid, you can proceed to the controller
  next();
  return;
};

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

    console.log(decoded.regimentId + " " + req.params.regimentId);
    console.log(decoded.regimentId + " " + req.body.regimentId);

    if (req.params.regimentId && decoded.regimentId == req.params.regimentId) {
      console.log(
        "PARAMS: " + req.params.regimentId + " " + decoded.regimentId
      );
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    if (req.body.regimentId && decoded.regimentId == req.body.regimentId) {
      console.log("BODY: " + req.body.regimentId + " " + decoded.regimentId);
      req.body.regimentId = decoded.regimentId;
      next();
      return;
    }

    return res.status(401).send({
      message: "Unauthorized!",
    });
  });
};

// Export the authJwt object
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin,
  verifyRegiment: verifyRegiment,
  checkBearerToken: checkBearerToken
};
module.exports = authJwt;