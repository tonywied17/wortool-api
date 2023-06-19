const db = require("../models");
const SteamID = db.steamid;

exports.findAll = (req, res) => {
  SteamID.findAll()
    .then((steamids) => {
      res.send(steamids);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  SteamID.findByPk(id)
    .then((steamid) => {
      res.send(steamid);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving SteamID with id=" + id,
      });
    });
};

exports.createOrUpdate = (req, res) => {
  const steamId = req.params.steamId;
  const name = req.body.name;
  const idSteam = req.body.idSteam;
  const steamid = {
    name: name,
    idSteam: idSteam,
  };
  SteamID.upsert(steamid, { where: { id: steamId } })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "SteamID was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update SteamID with id=${steamId}. Maybe SteamID was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating SteamID with id=" + steamId,
      });
    });
};

exports.delete = (req, res) => {
  const steamId = req.params.steamId;

  SteamID.destroy({
    where: { id: steamId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "SteamID was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete SteamID with id=${steamId}. Maybe SteamID was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete SteamID with id=" + steamId,
      });
    });
};
