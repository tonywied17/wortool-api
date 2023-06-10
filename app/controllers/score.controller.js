const db = require("../models");
const Score = db.score;

exports.findAll = (req, res) => {

  Score.findAll({
    order: [
      ["score", "DESC"],
    ],
  })
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





