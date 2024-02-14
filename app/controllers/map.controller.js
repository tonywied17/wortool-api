/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\map.controller.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp57193\public_html\api.wortool.com\wor-api\app\controllers
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue February 13th 2024 8:51:00 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Map = db.Maps;
const MapsRegimentWeapons = db.MapsUnits;
const MapsRegiments = db.MapsRegiments;
const Weapons = db.Weapon;
const axios = require("axios");


exports.findAllMaps = async (req, res) => {
  try {
    const maps = await Map.findAll({
      include: [{
        model: MapsRegiments,
        as: 'wor_mapsRegiments',
        include: [{
          model: MapsRegimentWeapons,
          as: 'wor_mapsRegimentWeapons',
          include: [{
            model: Weapons,
            as: 'wor_Weapon',
          }]
        }]
      }]
    });

    if (maps.length > 0) {
      res.status(200).send(maps);
    } else {
      res.status(404).send({ message: "No maps found." });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving maps: " + error.message
    });
  }
};

exports.findOneMap = async (req, res) => {
  try {
    const mapId = req.params.id;

    const map = await Map.findOne({
      where: { id: mapId },
      include: [{
        model: MapsRegiments,
        as: 'wor_mapsRegiments',
        include: [{
          model: MapsRegimentWeapons,
          as: 'wor_mapsRegimentWeapons',
          include: [{
            model: Weapons,
            as: 'wor_Weapon',
          }]
        }]
      }]
    });

    if (map) {
      res.status(200).send(map);
    } else {
      res.status(404).send({ message: "Map not found." });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving map: " + error.message
    });
  }
};



exports.createMap = async (req, res) => {
  const { map, regiments } = req.body;

  try {
    const result = await db.sequelize.transaction(async (t) => {

      const createdMap = await Map.create(map, { transaction: t });

      for (const regiment of regiments) {
        const createdRegiment = await MapsRegiments.create({
          ...regiment,
          mapId: createdMap.id,
        }, { transaction: t });

        if (regiment.units && regiment.units.length > 0) {
          for (const unit of regiment.units) {
            await MapsRegimentWeapons.create({
              ...unit,
              mapsRegimentsId: createdRegiment.id,
              mapId: createdMap.id,
            }, { transaction: t });
          }
        }
      }
      
      return createdMap;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating full map with regiments and units:", error);
    res.status(500).send({
      message: "Error creating map with regiments and units",
    });
  }
};


exports.updateMap = async (req, res) => {
  const { id } = req.params;
  const map = req.body.map;
  const regiments = req.body.wor_mapsRegiments;
  console.log("map", map);
  console.log("regiments", regiments);
  console.log("regiment weapons", regiments[0].wor_mapsRegimentWeapons);
  
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const existingMap = await Map.findByPk(id, { transaction: t });
      if (!existingMap) {
        return res.status(404).send({ message: `Cannot find Map with id=${id}.` });
      }

      await existingMap.update(map, { transaction: t });

      const existingRegiments = await existingMap.getWor_mapsRegiments({ transaction: t });
      for (const existingRegiment of existingRegiments) {
        const regimentInUpdatedList = regiments.find(regiment => regiment.id === existingRegiment.id);
        if (!regimentInUpdatedList) {
          await existingRegiment.destroy({ transaction: t });
        }
      }

      for (const regiment of regiments) {
        let createdOrUpdatedRegiment;
        if (regiment.id) {
          createdOrUpdatedRegiment = await MapsRegiments.findByPk(regiment.id, { transaction: t });
          await createdOrUpdatedRegiment.update(regiment, { transaction: t });

          if (regiment.wor_mapsRegimentWeapons.length === 0) {
            await MapsRegimentWeapons.destroy({ where: { mapsRegimentsId: regiment.id }, transaction: t });
          } else {
            for (const weapon of regiment.wor_mapsRegimentWeapons) {
              const { id, unitWeaponId, mapsRegimentsId, mapId } = weapon;
              let createdOrUpdatedWeapon;
              if (id) {
                createdOrUpdatedWeapon = await MapsRegimentWeapons.findByPk(id, { transaction: t });
                await createdOrUpdatedWeapon.update({ unitWeaponId, mapsRegimentsId, mapId }, { transaction: t });
              } else {
                try {
                  createdOrUpdatedWeapon = await MapsRegimentWeapons.create({
                    unitWeaponId,
                    mapsRegimentsId,
                    mapId,
                  }, { transaction: t });
                } catch (error) {
                  console.error("Error creating weapon:", error);
                }
              }
            }
          }
        } else {
          createdOrUpdatedRegiment = await MapsRegiments.create({
            ...regiment,
            mapId: id,
          }, { transaction: t });

          const weapons = regiment.wor_mapsRegimentWeapons;
          for (const weapon of weapons) {
            const { unitWeaponId, mapsRegimentsId, mapId } = weapon;
            try {
              await MapsRegimentWeapons.create({
                unitWeaponId,
                mapsRegimentsId,
                mapId,
              }, { transaction: t });
            } catch (error) {
              console.error("Error creating weapon:", error);
            }
          }
        }
      }

      return existingMap;
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating map with regiments and units:", error);
    res.status(500).send({
      message: "Error updating map with regiments and units",
    });
  }
};


exports.updateMapRegiment = async (req, res) => {
  const id = req.params.id;
  const regimentDetails = req.body;

  try {
    const [updated] = await MapsRegiments.update(regimentDetails, {
      where: { id: id }
    });

    if (updated) {
      const updatedRegiment = await MapsRegiments.findByPk(id);
      res.status(200).send(updatedRegiment);
    } else {
      res.status(404).send({ message: "Regiment not found." });
    }
  } catch (error) {
    console.error("Error updating regiment:", error);
    res.status(500).send({ message: "Error updating regiment." });
  }
};


exports.updateMapUnit = async (req, res) => {
  const id = req.params.id;
  const unitDetails = req.body;

  try {
    const [updated] = await MapsRegimentWeapons.update(unitDetails, {
      where: { id: id }
    });

    if (updated) {
      const updatedUnit = await MapsRegimentWeapons.findByPk(id);
      res.status(200).send(updatedUnit);
    } else {
      res.status(404).send({ message: "Unit not found." });
    }
  } catch (error) {
    console.error("Error updating unit:", error);
    res.status(500).send({ message: "Error updating unit." });
  }
};


/**
 * Retrieve all maps from the database.
 * This function is used to retrieve all maps from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the maps
 */
exports.findAll = (req, res) => {
  Map.findAll()
    .then(async (data) => {
      res.header("Content-Type", "application/json");
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving maps.",
      });
    });
};

/**
 * Retrieve a single map with an id.
 * This function is used to retrieve a single map with an id.
 * 
 * @param {*} req - request containing the id
 * @param {*} res - response containing the map
 */
exports.findOne = (req, res) => {
  const id = req.params.id;

  Map.findByPk(id)
    .then(async (data) => {
      if (data) {
        const axiosInstance = axios.create({
          method: "get",
          baseURL: "https://app.paarmy.com/api.php?id=" + id,
          headers: {},
        });

        const response = await axiosInstance.get();

        let shittyJSON = response.data;
        remove_empty(shittyJSON);

        let mapData = data.get({ plain: true });

        const mergedObject = {
          ...mapData,
          ...shittyJSON,
        };

        res.header("Content-Type", "application/json");
        res.send(mergedObject);
      } else {
        res.status(404).send({
          message: `Cannot find Map with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Map with id=" + id,
      });
    });
};

/**
 * Retrieve all maps from the database.
 * This function is used to retrieve all maps from the database.
 * 
 * @param {*} req - request
 * @param {*} res - response containing the maps
 */
exports.findAllBig = (req, res) => {
  Map.findAll()
    .then(async (data) => {
      res.header("Content-Type", "application/json");

      const mergedData = [];

      for (const map of data) {
        const axiosInstance = axios.create({
          method: "get",
          baseURL: "https://app.paarmy.com/api.php?id=" + map.id,
          headers: {},
        });

        const response = await axiosInstance.get();
        let shittyJSON = response.data;
        remove_empty(shittyJSON);

        const mapData = map.get({ plain: true });

        const mergedObject = {
          ...mapData,
          ...shittyJSON,
        };

        mergedData.push(mergedObject);
      }

      res.send(mergedData);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving maps.",
      });
    });
};

function remove_empty(target) {
  Object.keys(target).map(function (key) {
    if (target[key] instanceof Object) {
      if (
        !Object.keys(target[key]).length &&
        typeof target[key].getMonth !== "function"
      ) {
        delete target[key];
      } else {
        remove_empty(target[key]);
      }
    } else if (target[key] === null) {
      delete target[key];
    }
  });

  return target;
}
