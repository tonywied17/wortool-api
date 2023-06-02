const db = require("../models");
const Map = db.maps;
const Op = db.Sequelize.Op;
const axios = require('axios');



// Retrieve all Maps from the database.
exports.findAll = (req, res) => {

  Map.findAll()
    .then(async data => {

      res.header("Content-Type", 'application/json');

      let test = data.forEach(element => {
        console.log(element.id)
      })

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving maps."
      });
    });
};

//get big map object
exports.findAllBig = (req, res) => {

  Map.findAll()
  .then(async (data) => {
    res.header("Content-Type", 'application/json');

    const mergedData = [];

    for (const map of data) {
      console.log('https://app.paarmy.com/api.php?id=' + map.id);
      const axiosInstance = axios.create({
        method: 'get',
        baseURL: 'https://app.paarmy.com/api.php?id=' + map.id,
        headers: {}
      });

      const response = await axiosInstance.get();
      let shittyJSON = response.data;
      remove_empty(shittyJSON);

      const mapData = map.get({ plain: true });

      const mergedObject = {
        ...mapData,
        ...shittyJSON
      };

      mergedData.push(mergedObject);
    }

    res.send(mergedData);
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving maps."
    });
  });

};

// Find a single Map with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Map.findByPk(id)
    .then(async data => {
      if (data) {
        const axiosInstance = axios.create({
          method: 'get',
          baseURL: 'https://app.paarmy.com/api.php?id=' + id,
          headers: {}
        });

        const response = await axiosInstance.get();


        let shittyJSON = response.data
        remove_empty(shittyJSON);


        let mapData = data.get({ plain: true })

        const mergedObject = {
          ...mapData,
          ...shittyJSON
        };

        res.header("Content-Type", 'application/json');
        res.send(mergedObject)



      } else {
        res.status(404).send({
          message: `Cannot find Map with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Map with id=" + id
      });
    });
};


function remove_empty(target) {

  Object.keys(target).map(function (key) {

    if (target[key] instanceof Object) {
      if (!Object.keys(target[key]).length && typeof target[key].getMonth !== 'function') {
        delete target[key];
      }
      else {
        remove_empty(target[key]);
      }
    }
    else if (target[key] === null) {
      delete target[key];
    }
  });

  return target;

};

