const db = require("../models");
const Weapon = db.weapon;

exports.findAll = (req, res) => {

  Weapon.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving muster items."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Weapon.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find weapon with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving weapon with id=" + id
      });
    });
};

exports.createWeapon = (req, res) => {

  const weapon = {
    weapon: req.body.weapon,
    range: req.body.range,
    lengthy: req.body.lengthy,
    ammo: req.body.ammo,
    notes: req.body.notes
  };

  Weapon.create(weapon)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Blog."
      });
    });
};

