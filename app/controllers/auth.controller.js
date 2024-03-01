/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\auth.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri March 1st 2024 12:56:34 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const emails = require("./htmlEmails/emails");
const models = require("../models");
const User = models.User;
const DiscordUser = models.DiscordUser;
const Role = models.Role;
const Op = models.Sequelize.Op;
const dotenv = require("dotenv");
dotenv.config({ path: "/home/paarmy/envs/wor/.env" });
const { randomBytes } = require('node:crypto');

/**
 * Create and Save a new User
 * This function is used to create a new user in the database.
 * @param {*} req - request containing the username, email, and password
 * @param {*} res - response containing the user
 */
exports.signup = async (req, res) => {
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
          user.setWor_Roles(roles).then(() => {
            res.send({
              message: "User registered successfully!",
            });
          });
        });
      } else {
        user.setWor_Roles([1]).then(async () => {
          const transporter = nodemailer.createTransport({
            sendmail: true,
            path: "/usr/sbin/sendmail",
          });
          const htmlContent = emails.welcomeEmail(req.body.username.toLowerCase());
          const mailOptions = {
            from: "accounts@wortool.com",
            to: user.email,
            subject: "Welcome to WoRTool!",
            html: htmlContent,
          };
          await transporter.sendMail(mailOptions);
          res.send({
            message: "User registered successfully!",
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Set User as Moderator
 * This function is used to set a user as a moderator.
 * @param {*} req - request containing the userId
 * @param {*} res - response message notifying if the user was set as a moderator
 */
exports.setModerator = async (req, res) => {
  const memberId = req.params.memberId;
  User.findOne({
    where: {
      id: memberId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found.",
        });
      }
      user.getWor_Roles().then((roles) => {
        const hasRole2 = roles.some((role) => role.id === 2);

        if (!hasRole2) {
          roles.push(2);
        }
        user.setWor_Roles(roles).then(() => {
          res.send({
            message: "User roles updated successfully!",
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Remove User as Moderator
 * This function is used to remove a user as a moderator.
 * @param {*} req - request containing the userId
 * @param {*} res - response message notifying if the user was removed as a moderator
 */
exports.removeModerator = async (req, res) => {
  const userID = req.params.memberId;
  User.findOne({
    where: {
      id: userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found.",
        });
      }
      user.getWor_Roles().then((roles) => {
        const updatedRoles = roles.filter((role) => role.id !== 2);
        user.setWor_Roles(updatedRoles).then(() => {
          res.send({
            message: "User roles updated successfully!",
          });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Process Forgot Password and Send Link/Token
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.forgot = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({
        error: "No user is registered with that email address.",
      });
    }
    const resetToken = randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const transporter = nodemailer.createTransport({
      sendmail: true,
      path: "/usr/sbin/sendmail",
    });
    const resetUrl = `https://wortool.com/reset/${resetToken}`;
    const htmlContent = emails.passwordResetEmail(user.username, resetUrl);
    const mailOptions = {
      from: "accounts@wortool.com",
      to: user.email,
      subject: "Password Reset Request",
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      message: "Password reset email sent. Check your email for instructions.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

/**
 * Process Reset Password
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.reset = async (req, res) => {
  const resetToken = req.params.token;
  const newPassword = req.body.newPassword;
  const today = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log("TODAY: " + today);
  console.log(resetToken + " : " + newPassword);
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
      },
    });

    if (
      !user ||
      new Date(user.resetPasswordExpires) >
        new Date(new Date().getTime() + 60 * 60000)
    ) {
      return res.status(400).json({
        error: "Invalid or expired reset token.",
      });
    }

    console.log("***USER: " + user);

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
}

/**
 * Signin
 * This function is used to signin a user.
 * @param {*} req - request containing the username and password
 * @param {*} res - response containing the user
 */
exports.signin = async (req, res) => {
  User.findOne({
    where: {
      username: req.body.username.toLowerCase(),
    },
    include: [{ model: DiscordUser, as: "wor_DiscordUser" }],
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User Not found.",
        });
      }

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let tokenPayload = {
        id: user.id,
        regimentId: user.regimentId,
        discordUser: user.wor_DiscordUser
          ? {
              username: user.wor_DiscordUser.username,
              discordId: user.wor_DiscordUser.discordId,
              avatar: user.wor_DiscordUser.avatar,
            }
          : null,
      };

      let token = jwt.sign(tokenPayload, process.env.AUTH_SECRET, {
        expiresIn: 31536000, // 1 year
      });

      let authorities = [];
      user.getWor_Roles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        res.cookie("token", token, { httpOnly: true, maxAge: 31536000000 });

        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          avatar_url: user.avatar_url,
          discordId: user.discordId,
          regimentId: user.regimentId,
          roles: authorities,
          accessToken: token,
          discordUser: tokenPayload.discordUser,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Update User Password
 * This function is used to update a user's password.
 * @param {*} req - request containing the userId, passwordCurrent, and passwordNew
 * @param {*} res - response message notifying if the user's password was updated
 */
exports.password = async (req, res) => {
  const userID = req.params.userId;
  const passwordCurrent = req.body.passwordCurrent;
  const passwordNew = req.body.passwordNew;
  User.findOne({
    where: {
      id: userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found.",
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
      User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: userID,
          },
        }
      )
        .then(() => {
          res.status(200).send({
            message: "Password updated successfully!",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Update User Profile Picture
 * This function is used to update a user's profile picture.
 * @param {*} req
 * @param {*} res
 */
exports.profilePic = async (req, res) => {
  const userID = req.params.userId;
  const avatar_url = req.body.avatar_url;
  User.findOne({
    where: {
      id: userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User ID Not found.",
        });
      }

      User.update(
        {
          avatar_url: avatar_url,
        },
        {
          where: {
            id: userID,
          },
        }
      )
        .then(() => {
          res.status(200).send({
            message: "Profile picture updated successfully!",
          });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}

/**
 * Update User Profile
 * This function is used to update a user's profile.
 * @param {*} req - request containing the userId, email, avatar_url, discordId, and regimentId
 * @param {*} res - response message notifying if the user's profile was updated
 */
exports.profile = async (req, res) => {
  const userID = req.params.userId;
  const email = req.body.email;
  const avatar_url = req.body.avatar_url;
  const discordId = req.body.discordId;
  const regimentId = req.body.regimentId;

  User.findOne({
    where: {
      email: email,
      id: {
        [Op.not]: userID,
      },
    },
  })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({
          message: "Email is already taken.",
        });
      }

      DiscordUser.findOne({
        where: {
          userId: userID,
        },
      })
        .then((discordUser) => {
          if (discordUser) {
            const updateFields = {};
            if (avatar_url) {
              updateFields.avatar_url = avatar_url;
            }
            DiscordUser.update(updateFields, {
              where: {
                userId: userID,
              },
            }).catch((err) => {
              console.error("Error updating DiscordUser:", err.message);
            });
          }
        })
        .catch((err) => {
          console.error("Error looking for DiscordUser:", err.message);
        });
      User.findOne({
        where: {
          id: userID,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).send({
              message: "User ID Not found.",
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
                message: "Profile updated successfully!",
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message,
              });
            });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
}
