const db = require("../models");
const Weapon = db.weapon;

exports.findAll = (req, res) => {
  Weapon.findAll()
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
  const id = req.params.id;

  Weapon.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find weapon with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving weapon with id=" + id,
      });
    });
};

exports.createOrUpdateWeapon = (req, res) => {
  const weaponName = req.body.weapon;
  const weapon = {
    weapon: weaponName,
    type: req.body.type,
    range: req.body.range,
    lengthy: req.body.lengthy,
    ammo: req.body.ammo,
    image: req.body.image,
    notes: req.body.notes,
  };

  const id = req.params.weaponId;

  console.log(weapon);

  // Update existing weapon or create new weapon
  Weapon.findOne({ where: { id: id } })
    .then((existingWeapon) => {
      if (existingWeapon) {
        // Update existing weapon
        Weapon.update(weapon, { where: { id: id } })
          .then((num) => {
            if (num[0] === 1) {
              res.send({
                message: "Weapon was updated successfully.",
              });
            } else {
              res.status(500).send({
                message: `Cannot update weapon with name '${weaponName}'. Maybe weapon was not found or req.body is empty!`,
              });
            }
          })
          .catch((err) => {
            res.status(500).send({
              message:
                "Error updating weapon with name '" +
                weaponName +
                "': " +
                err.message,
            });
          });
      } else {
        // Create new weapon
        Weapon.create(weapon)
          .then((data) => {
            res.send({
              message: "Weapon was created successfully.",
              weapon: data,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error creating weapon: " + err.message,
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error checking if weapon exists: " + err.message,
      });
    });
};

exports.deleteWeapon = (req, res) => {
  const id = req.params.weaponId;
  Weapon.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Weapon was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete weapon with id=${id}. Maybe weapon was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete weapon with id=" + id,
      });
    });
};
