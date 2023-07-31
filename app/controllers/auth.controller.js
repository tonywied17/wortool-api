/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\auth.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 3:38:18 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const DiscordUser = db.discordUser;
const Role = db.role;
const Op = db.Sequelize.Op;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");


/**
 * Create and Save a new User
 * This function is used to create a new user in the database.
 * 
 * @param {*} req - request containing the username, email, and password
 * @param {*} res - response containing the user
 */
exports.signup = (req, res) => {
  User.create({
      username: req.body.username.toLowerCase(),
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: "User registered successfully!"
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({
            message: "User registered successfully!"
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};


/**
 * Set User as Moderator
 * This function is used to set a user as a moderator.
 * 
 * @param {*} req - request containing the userId
 * @param {*} res - response message notifying if the user was set as a moderator
 */
exports.setModerator = (req, res) => {
  const userID = req.params.userId;

  User.findOne({
      where: {
        id: userID,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found."
        });
      }

      user.getRoles().then((roles) => {
        const hasRole2 = roles.some(role => role.id === 2);
        
        if (!hasRole2) {
          roles.push(2);
        }

        user.setRoles(roles).then(() => {
          res.send({
            message: "User roles updated successfully!"
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

/**
 * Remove User as Moderator
 * This function is used to remove a user as a moderator.
 * @param {*} req - request containing the userId
 * @param {*} res - response message notifying if the user was removed as a moderator
 */
exports.removeModerator = (req, res) => {
  const userID = req.params.userId;

  User.findOne({
      where: {
        id: userID,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found."
        });
      }

      user.getRoles().then((roles) => {

        const updatedRoles = roles.filter(role => role.id !== 2); // Remove role 2 from the roles array

        user.setRoles(updatedRoles).then(() => {
          res.send({
            message: "User roles updated successfully!"
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

/**
 * Signin
 * This function is used to signin a user.
 * 
 * @param {*} req - request containing the username and password
 * @param {*} res - response containing the user 
 */
exports.signin = (req, res) => {
  User.findOne({
      where: {
        username: req.body.username.toLowerCase(),
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User Not found."
        });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = jwt.sign({
        id: user.id,
        regimentId: user.regimentId,
      }, config.secret, {
        expiresIn: 31536000, // 1 year
      });

      let authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          discordId: user.discordId,
          regimentId: user.regimentId,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

/**
 * Update User Password
 * This function is used to update a user's password.
 * 
 * @param {*} req - request containing the userId, passwordCurrent, and passwordNew
 * @param {*} res - response message notifying if the user's password was updated
 */
exports.password = (req, res) => {
  const userID = req.params.userId;
  const passwordCurrent = req.body.passwordCurrent;
  const passwordNew = req.body.passwordNew;

  console.log("userID: " + userID);

  User.findOne({
      where: {
        id: userID,
      },
    })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found."
        });
      }

      let passwordIsValid = bcrypt.compareSync(passwordCurrent, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const hashedPassword = bcrypt.hashSync(passwordNew, 8);

      User.update({
          password: hashedPassword
        }, {
          where: {
            id: userID,
          },
        })
        .then(() => {
          res.status(200).send({
            message: "Password updated successfully!"
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};

/**
 * Update User Profile
 * This function is used to update a user's profile.
 * 
 * @param {*} req - request containing the userId, email, avatar_url, discordId, and regimentId
 * @param {*} res - response message notifying if the user's profile was updated
 */
exports.profile = (req, res) => {
  const userID = req.params.userId;
  const email = req.body.email;
  const avatar_url = req.body.avatar_url;
  const discordId = req.body.discordId;
  const regimentId = req.body.regimentId;

  console.log("userID: " + userID);
  console.log("email: " + email);
  console.log("avatar_url: " + avatar_url);
  console.log("discordId: " + discordId);
  console.log("regimentId: " + regimentId);

  User.findOne({
      where: {
        email: email,
        id: {
          [Op.not]: userID
        },
      },
    })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({
          message: "Email is already taken."
        });
      }

      DiscordUser.findOne({
          where: {
            userId: userID,
          },
        })

        .then((discordUser) => {
          if (!discordUser) {
            return res.status(404).send({
              message: "Discord User Not found."
            });
          }

          const updateFields = {};

          if (avatar_url) {
            updateFields.avatar_url = avatar_url;
          }

          DiscordUser.update(updateFields, {
              where: {
                userId: userID,
              },
            })
            .then(() => {
              res.status(200).send({
                message: "Discord User updated successfully!"
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });


      User.findOne({
          where: {
            id: userID,
          },
        })
        .then((user) => {
          if (!user) {
            return res.status(404).send({
              message: "User ID Not found."
            });
          }

          const updateFields = {};

          if (email) {
            updateFields.email = email;
          }

          if (avatar_url) {
            updateFields.avatar_url = avatar_url;
          }

          if (discordId) {
            updateFields.discordId = discordId;
          }

          if (regimentId) {
            updateFields.regimentId = regimentId;
          }

          User.update(updateFields, {
              where: {
                id: userID,
              },
            })
            .then(() => {
              res.status(200).send({
                message: "Profile updated successfully!"
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message
      });
    });
};