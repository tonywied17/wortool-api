const db = require("../models");
const Us = db.us;

exports.findAll = (req, res) => {

  Us.findAll()
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
    Us.findAll({ where: { day: req.params.day } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving us day."
        });
      });
  };

exports.findOne = (req, res) => {
    const day = req.params.day;
  
    Us.findOne(day)
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



