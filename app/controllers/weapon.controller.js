const db = require("../models");
const Weapon = db.weapon;
const Op = db.Sequelize.Op;

// Retrieve all weapon items from the database.
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

// Find a single weapon item with an id
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
      length: req.body.length, 
      ammo: req.body.ammo,
      notes: req.body.notes
    };

    // Save Weapon to Database
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

