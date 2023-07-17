const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const DiscordUser = db.discordUser;
const Role = db.role;
const Op = db.Sequelize.Op;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

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
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


exports.setModerator = (req, res) => {
  const userID = req.params.userId;

  User.findOne({
    where: {
      id: userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User ID Not found." });
      }

      user.getRoles().then((roles) => {
        
        // Check if role 2 is already present in the roles array
        const hasRole2 = roles.some(role => role.id === 2);

        // Add role 2 to the updated roles if it's not already present
        if (!hasRole2) {
          roles.push(2);
        }

        user.setRoles(roles).then(() => {
          res.send({ message: "User roles updated successfully!" });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


exports.removeModerator = (req, res) => {
  const userID = req.params.userId;

  User.findOne({
    where: {
      id: userID,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User ID Not found." });
      }
  
      user.getRoles().then((roles) => {
        
        const updatedRoles = roles.filter(role => role.id !== 2); // Remove role 2 from the roles array
        
        user.setRoles(updatedRoles).then(() => {
          res.send({ message: "User roles updated successfully!" });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username.toLowerCase(),
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
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

      let token = jwt.sign({ id: user.id, regimentId: user.regimentId, }, config.secret, {
        expiresIn: 31536000, // 24 hours sike 1 Year
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
      res.status(500).send({ message: err.message });
    });
};

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
        return res.status(404).send({ message: "User ID Not found." });
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
        { password: hashedPassword },
        {
          where: {
            id: userID,
          },
        }
      )
        .then(() => {
          res.status(200).send({ message: "Password updated successfully!" });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

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

  // Check if the email is already taken by another user
  User.findOne({
    where: {
      email: email,
      id: { [Op.not]: userID }, // Exclude the current user's ID from the query
    },
  })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).send({ message: "Email is already taken." });
      }

      // Update the users discorduser object avatar url
      DiscordUser.findOne({
        where: {
          userId: userID,
        },
      })

        .then((discordUser) => {
          if (!discordUser) {
            return res.status(404).send({ message: "Discord User Not found." });
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
              res.status(200).send({ message: "Discord User updated successfully!" });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });


      // Update the user's profile
      User.findOne({
        where: {
          id: userID,
        },
      })
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "User ID Not found." });
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
              res.status(200).send({ message: "Profile updated successfully!" });
            })
            .catch((err) => {
              res.status(500).send({ message: err.message });
            });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
