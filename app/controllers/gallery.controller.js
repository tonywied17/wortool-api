const db = require("../models");
const Gallery = db.gallery;

// Retrieve all gallery items from the database.
exports.findAll = (req, res) => {

  Gallery.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving gallery items."
      });
    });
};

// Find a single gallery item with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Gallery.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find gallery item with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving gallery item with id=" + id
        });
      });
  };



