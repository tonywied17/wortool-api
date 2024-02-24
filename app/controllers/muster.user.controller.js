/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\controllers\muster.user.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:12:05 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

const db = require("../models");
const MusterUser = db.MusterUser;
const Regiment = db.Regiment;

/**
 * Find all MusterUsers
 * Returns all MusterUsers for a specific regiment
 * @param {*} req
 * @param {*} res
 */
exports.findAll = (req, res) => {
  const regimentId = req.params.regimentId;
  MusterUser.findAll({
    where: {
      regimentId: regimentId,
    },
  })
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
 * Find all MusterUsers by Guild
 * Returns all MusterUsers for a specific guild
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAllByGuild = async (req, res) => {
  const guildId = req.params.guildId;

  try {
    const regiment = await Regiment.findOne({
      where: {
        guild_id: guildId,
      },
    });
    if (!regiment) {
      return res.send([]);
    }

    const data = await MusterUser.findAll({
      where: {
        regimentId: regiment.id,
      },
    });

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving muster items.",
    });
  }
};

/**
 * Find one MusterUser by Discord ID and Regiment ID
 * Returns a single MusterUser for a specific discordId and regimentId
 * @param {*} req 
 * @param {*} res 
 */
exports.findOne = (req, res) => {
  const discordId = req.params.discordId;
  const regimentId = req.params.regimentId;

  MusterUser.findOne({
    where: {
      discordId: discordId,
      regimentId: regimentId,
    },
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find MusterUser with discordId=${discordId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving MusterUser with discordId=" + discordId,
      });
    });
};

/**
 * Update a MusterUser
 * Updates a MusterUser with the given data
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
  const discordId = req.body.discordId;
  const regimentId = req.body.regimentId;
  const updatedData = req.body;

  MusterUser.findOne({
    where: {
      discordId: discordId,
      regimentId: regimentId,
    },
  })
    .then((musterUser) => {
      if (musterUser) {
        musterUser
          .update(updatedData)
          .then(() => {
            res.send({ message: "MusterUser updated successfully." });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating MusterUser: " + err.message,
            });
          });
      } else {
        res.status(404).send({
          message: `Cannot find MusterUser with discordId=${discordId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving MusterUser: " + err.message,
      });
    });
};

/**
 * Create a MusterUser
 * Creates a new MusterUser with the given data
 * @param {*} req 
 * @param {*} res 
 */
exports.create = (req, res) => {
  const newData = req.body;

  if (!Array.isArray(newData)) {
    newData = [newData];
  }

  Promise.all(
    newData.map((item) => {
      const discordId = item.discordId;
      const regimentId = item.regimentId;
      return MusterUser.findOne({
        where: {
          discordId: discordId,
          regimentId: regimentId,
        },
      })
        .then((existingMusterUser) => {
          if (existingMusterUser) {
            return {
              message: `MusterUser with discordId=${discordId} and regimentId=${regimentId} already exists.`,
              data: existingMusterUser,
              status: 409,
            };
          } else {
            return MusterUser.create(item)
              .then((createdMusterUser) => {
                return {
                  message: "MusterUser created successfully.",
                  data: createdMusterUser,
                  status: 200,
                };
              })
              .catch((err) => {
                return {
                  message: "Error creating MusterUser: " + err.message,
                  status: 500,
                };
              });
          }
        })
        .catch((err) => {
          return {
            message: "Error checking existing MusterUser: " + err.message,
            status: 500,
          };
        });
    })
  )
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error processing MusterUser creation: " + err.message,
      });
    });
};

/**
 * Increment the events field
 * Increments the events field by 1 for a specific MusterUser
 * @param {*} req 
 * @param {*} res 
 */
exports.incrementEvents = (req, res) => {
  const discordId = req.body.discordId;
  const regimentId = req.body.regimentId;

  MusterUser.findOne({
    where: {
      discordId: discordId,
      regimentId: regimentId,
    },
  })
    .then((musterUser) => {
      if (musterUser) {
        musterUser
          .increment("events", { by: 1 })
          .then(() => {
            res.send({ message: "Events incremented successfully." });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error incrementing events: " + err.message,
            });
          });
      } else {
        res.status(404).send({
          message: `Cannot find MusterUser with discordId=${discordId} and regimentId=${regimentId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving MusterUser: " + err.message,
      });
    });
};

/**
 * Increment the drills field
 * Increments the drills field by 1 for a specific MusterUser
 * @param {*} req 
 * @param {*} res 
 */
exports.incrementDrills = (req, res) => {
  const discordId = req.body.discordId;
  const regimentId = req.body.regimentId;

  MusterUser.findOne({
    where: {
      discordId: discordId,
      regimentId: regimentId,
    },
  })
    .then((musterUser) => {
      if (musterUser) {
        musterUser
          .increment("drills", { by: 1 })
          .then(() => {
            res.send({ message: "Drills incremented successfully." });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error incrementing drills: " + err.message,
            });
          });
      } else {
        res.status(404).send({
          message: `Cannot find MusterUser with discordId=${discordId} and regimentId=${regimentId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving MusterUser: " + err.message,
      });
    });
};

/**
 * Update all MusterUsers
 * Updates all MusterUsers with the given data
 * @param {*} req 
 * @param {*} res 
 */
exports.updateAll = (req, res) => {
  const updatedData = req.body;
  Promise.all(
    updatedData.map((item) => {
      const discordId = item.discordId;
      const regimentId = item.regimentId;

      return MusterUser.findOne({
        where: {
          discordId: discordId,
          regimentId: regimentId,
        },
      })
        .then((musterUser) => {
          if (musterUser) {
            return musterUser
              .update(item)
              .then(() => {
                return {
                  message: `MusterUser with discordId=${discordId} and regimentId=${regimentId} updated successfully.`,
                  status: 200,
                };
              })
              .catch((err) => {
                return {
                  message: `Error updating MusterUser with discordId=${discordId} and regimentId=${regimentId}: ${err.message}`,
                  status: 500,
                };
              });
          } else {
            return {
              message: `Cannot find MusterUser with discordId=${discordId} and regimentId=${regimentId}.`,
              status: 404,
            };
          }
        })
        .catch((err) => {
          return {
            message: `Error retrieving MusterUser with discordId=${discordId} and regimentId=${regimentId}: ${err.message}`,
            status: 500,
          };
        });
    })
  )
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error processing MusterUser updates: " + err.message,
      });
    });
};
