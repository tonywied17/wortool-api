/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\auth.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 3:10:28 
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
const Sequelize = db.sequelize;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const { randomBytes } = require('node:crypto');

require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });
/**
 * Create and Save a new User
 * This function is used to create a new user in the database.
 * 
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
          user.setRoles(roles).then(() => {
            res.send({
              message: "User registered successfully!"
            });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(async () => {

          const transporter = nodemailer.createTransport({
            sendmail: true,
            path: '/usr/sbin/sendmail',
          });

          const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to WoRTool!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1f2937; color: #88887b;">
          
            <div style="width: 100%; max-width: 600px; margin: 5px; padding: 1em; box-sizing: border-box;">
          
            <img src="https://wortool.com/app-icon-wortool.png" style="margin:auto;height:100px;width:auto;">
              
              <div style="background:#7d7e73;color: #1f2937;width:100%;max-width:600px;padding:0.5em;font-weight:700;font-size:15px;">Welcome to WoRTool!</div>
          
              <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Hello ${req.body.username.toLowerCase()},</p>
      
              <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Congratulations! Your WoRTool account has been successfully created.</p>
          
              <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">You can now log in and start exploring the features of WoRTool.</p>
          
              <p style="margin-bottom: 20px;margin-left: 8px;">Login to your account <a href="https://wortool.com/home" target="_blank" style="color: #88887b;">here</a>.</p>
          
              <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important">If you have any questions or need assistance, feel free to contact us at support@wortool.com.</p>
          
             
            </div>
          
          </body>
          </html>
          
            `;

          const mailOptions = {
            from: 'accounts@wortool.com',
            to: user.email,
            subject: 'Welcome to WoRTool!',
            html: htmlContent,
          };

          await transporter.sendMail(mailOptions);

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
  const memberId = req.params.memberId;

  User.findOne({
    where: {
      id: memberId,
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
  const userID = req.params.memberId;

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
 * Forgot Login
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

    const resetToken = randomBytes(20).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    const transporter = nodemailer.createTransport({
      sendmail: true,
      path: '/usr/sbin/sendmail',
    });

    const resetUrl = `https://wortool.com/reset/${resetToken}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #1f2937; color: #88887b;">
    
      <div style="width: 100%; max-width: 600px; margin: 5px; padding: 1em; box-sizing: border-box;">
    
      <img src="https://wortool.com/app-icon-wortool.png" style="margin:auto;height:100px;width:auto;">
        
        <div style="background:#7d7e73;color: #1f2937;width:100%;max-width:600px;padding:0.5em;font-weight:700;font-size:15px;">Password Reset Request</div>
    
        <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Hello ${user.username},</p>

        <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
    
        <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important;">Please click on the following link, or paste this into your browser to complete the process:</p>
    
        <p style="margin-bottom: 20px;margin-left: 8px;"><a href="${resetUrl}" target="_blank" style="color: #88887b;">${resetUrl}</a></p>
    
        <p style="margin-bottom: 20px;margin-left: 8px;color: #e5e5e5 !important">If you did not request this, please ignore this email, and your password will remain unchanged.</p>
    
       
      </div>
    
    </body>
    </html>
    
      `;

    const mailOptions = {
      from: 'accounts@wortool.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Password reset email sent. Check your email for instructions.',
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

/**
 * Reset Login
 */
exports.reset = async (req, res) => {
  const resetToken = req.params.token;
  const newPassword = req.body.newPassword;
  const today = new Date().toISOString().slice(0, 19).replace("T", " ");

  console.log('TODAY: ' + today)
  console.log(resetToken + " : " + newPassword)
  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: resetToken,
      }
    });

    if (!user || new Date(user.resetPasswordExpires) > new Date(new Date().getTime() + 60 * 60000)) {
      return res.status(400).json({
        error: 'Invalid or expired reset token.',
      });
    }

    console.log('***USER: ' + user)

    // Update the user's password and clear the reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: 'Password reset successful. You can now log in with your new password.',
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    return res.status(500).json({
      error: 'Internal Server Error',
    });
  }
}

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
          message: 'User Not found.',
        });
      }

      let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!',
        });
      }

      let token = jwt.sign(
        {
          id: user.id,
          regimentId: user.regimentId,
        },
        config.secret,
        {
          expiresIn: 31536000, // 1 year
        }
      );

      let authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase());
        }

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 31536000000 }); // Max age in milliseconds (1 year)

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
        message: err.message,
      });
    });
  }

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

      // Look for DiscordUser but don't return an error if not found
      DiscordUser.findOne({
        where: {
          userId: userID,
        },
      })
        .then((discordUser) => {
          if (discordUser) {
            // Only perform update if DiscordUser is found
            const updateFields = {};

            if (avatar_url) {
              updateFields.avatar_url = avatar_url;
            }

            DiscordUser.update(updateFields, {
              where: {
                userId: userID,
              },
            })
              .catch((err) => {
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