const db = require("../models");
const MusterUser = db.MusterUser;
const Regiment = db.Regiment

exports.findAll = (req, res) => {
    const regimentId = req.params.regimentId;
    MusterUser.findAll({
        where: {
          regimentId: regimentId
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

  exports.findAllByGuild = async (req, res) => {
    const guildId = req.params.guildId;

    const regiment = await Regiment.findOne({
            where: {
                guild_id: guildId
              },
        })

        console.log(regiment)

    await MusterUser.findAll({
        where: {
          regimentId: regiment.id
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
                // Update the MusterUser if it exists
                musterUser.update(updatedData)
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


// exports.create = (req, res) => {
//     const newData = req.body;
//     const discordId = req.body.discordId;
//     const regimentId = req.body.regimentId;

//     console.log('Regiment ID')

//     // Check if MusterUser with the same data already exists
//     MusterUser.findOne({
//         where: {
//             discordId: discordId,
//             regimentId: regimentId,
//         },
//     })
//         .then((existingMusterUser) => {
//             if (existingMusterUser) {
//                 res.status(409).send({
//                     message: "MusterUser with the given data already exists.",
//                 });
//             } else {
//                 // Create a new MusterUser if it doesn't exist
//                 MusterUser.create(newData)
//                     .then((createdMusterUser) => {
//                         res.send({
//                             message: "MusterUser created successfully.",
//                             data: createdMusterUser,
//                         });
//                     })
//                     .catch((err) => {
//                         res.status(500).send({
//                             message: "Error creating MusterUser: " + err.message,
//                         });
//                     });
//             }
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message: "Error checking existing MusterUser: " + err.message,
//             });
//         });
// };

exports.create = (req, res) => {
    const newData = req.body;

    // Check if newData is an array
    if (!Array.isArray(newData)) {
        // If it's not an array, convert it to an array with a single element
        newData = [newData];
    }

    // Use Promise.all to handle multiple asynchronous operations
    Promise.all(newData.map(item => {
        const discordId = item.discordId;
        const regimentId = item.regimentId;

        // Check if MusterUser with the same data already exists
        return MusterUser.findOne({
            where: {
                discordId: discordId,
                regimentId: regimentId,
            },
        })
        .then((existingMusterUser) => {
            if (existingMusterUser) {
                // Return an object with information about the duplicate entry
                return {
                    message: `MusterUser with discordId=${discordId} and regimentId=${regimentId} already exists.`,
                    data: existingMusterUser,
                    status: 409,
                };
            } else {
                // Create a new MusterUser if it doesn't exist
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
    }))
    .then(results => {
        // Send the results as an array of responses
        res.send(results);
    })
    .catch(err => {
        // Handle errors from Promise.all
        res.status(500).send({
            message: "Error processing MusterUser creation: " + err.message,
        });
    });
};



exports.incrementEvents = (req, res) => {
    const discordId = req.body.discordId;
    const regimentId = req.body.regimentId;

    // Find the matching MusterUser
    MusterUser.findOne({
        where: {
            discordId: discordId,
            regimentId: regimentId,
        },
    })
        .then((musterUser) => {
            if (musterUser) {
                // Increment the events field by 1
                musterUser.increment('events', { by: 1 })
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


exports.incrementDrills = (req, res) => {
    const discordId = req.body.discordId;
    const regimentId = req.body.regimentId;

    // Find the matching MusterUser
    MusterUser.findOne({
        where: {
            discordId: discordId,
            regimentId: regimentId,
        },
    })
        .then((musterUser) => {
            if (musterUser) {
                // Increment the events field by 1
                musterUser.increment('drills', { by: 1 })
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

exports.updateAll = (req, res) => {
    const updatedData = req.body;
    const guildId = req.params.guildId

    console.log(updatedData)
    
    Promise.all(updatedData.map(item => {
        const discordId = item.discordId;
        const regimentId = item.regimentId;

        // Find the matching MusterUser
        return MusterUser.findOne({
            where: {
                discordId: discordId,
                regimentId: regimentId,
            },
        })
        .then((musterUser) => {
            if (musterUser) {
                // Update the MusterUser if it exists
                return musterUser.update(item)
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
                // Return an error response if the MusterUser does not exist
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
    }))
    .then(results => {
        // Send the results as an array of responses
        res.send(results);
    })
    .catch(err => {
        // Handle errors from Promise.all
        res.status(500).send({
            message: "Error processing MusterUser updates: " + err.message,
        });
    });
};
