const db = require("../models");
const Eu = db.eu;
const Op = db.Sequelize.Op;


exports.findAll = (req, res) => {

  Eu.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    });
};

exports.findAllByDay = (req, res) => {
    Eu.findAll({ where: { day: req.params.day } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving eu day."
        });
      });
  };

exports.findOne = (req, res) => {
    const day = req.params.day;
  
    Eu.findOne(day)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find item with day=${day}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving item with day=" + day
        });
      });
  };



