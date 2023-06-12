const db = require("../models");
const Muster = db.muster;
const Op = db.Sequelize.Op;




// Retrieve all muster items from the database.
exports.findAll = (req, res) => {

  Muster.findAll()
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

// Find a single muster item with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Muster.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find muster item with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving muster item with id=" + id
        });
      });
  };



