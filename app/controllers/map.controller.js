/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\map.controller.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp19365\public_html\api.wortool.com\wor-api\app\controllers
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu February 15th 2024 10:37:05 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const db = require("../models");
const Map = db.Maps;
const MapsRegimentWeapons = db.MapsRegimentWeapons;
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
      const modifiedMaps = maps.map(map => {
        let USA_infantry_regiments = 0, CSA_infantry_regiments = 0;
        let USA_artillery_regiments = 0, CSA_artillery_regiments = 0;
        let USA_cavlary_regiments = 0, CSA_cavlary_regiments = 0;

        map.wor_mapsRegiments.forEach(regiment => {
          if (regiment.side === 'USA') {
            if (regiment.type === 'Infantry') USA_infantry_regiments++;
            else if (regiment.type === 'Artillery') USA_artillery_regiments++;
            else if (regiment.type === 'Cavalry') USA_cavlary_regiments++;
          } else if (regiment.side === 'CSA') {
            if (regiment.type === 'Infantry') CSA_infantry_regiments++;
            else if (regiment.type === 'Artillery') CSA_artillery_regiments++;
            else if (regiment.type === 'Cavalry') CSA_cavlary_regiments++;
          }
        });

        map.usaArty = map.usaArty === "true" || map.usaArty === true;
        map.csaArty = map.csaArty === "true" || map.csaArty === true;

        return {
          id: map.id,
          map: map.map,
          image: map.image,
          usaArty: map.usaArty,
          csaArty: map.csaArty,
          campaign: map.campaign,
          youtube: map.youtube,
          attacker: map.attacker,
          strat: map.strat,
          USA_infantry_regiments,
          CSA_infantry_regiments,
          USA_artillery_regiments,
          CSA_artillery_regiments,
          USA_cavlary_regiments,
          CSA_cavlary_regiments,
          wor_mapsRegiments: map.wor_mapsRegiments,
        };
      });

      res.status(200).send(modifiedMaps);
    } else {
      res.status(404).send({ message: "No maps found." });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving maps: " + error.message
    });
  }
};

exports.findAllMapsVerbose = async (req, res) => {
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
      const modifiedMaps = maps.map(map => {
        const USA_regiments = { Infantry: [], Artillery: [], Cavalry: [] };
        const CSA_regiments = { Infantry: [], Artillery: [], Cavalry: [] };

        map.usaArty = map.usaArty === "true" || map.usaArty === true;
        map.csaArty = map.csaArty === "true" || map.csaArty === true;

        map.wor_mapsRegiments.forEach(regiment => {
          const regimentWithRenamedWeapons = {
            ...regiment.toJSON(),
            regiment_weaponry: regiment.wor_mapsRegimentWeapons.map(weapon => {
              const weaponWithRenamedApi = {
                ...weapon.toJSON(),
                weapon_api: {
                  ...weapon.wor_Weapon.toJSON(),
                  length: weapon.wor_Weapon.lengthy,
                }
              };
              delete weaponWithRenamedApi.weapon_api.lengthy;
              delete weaponWithRenamedApi.wor_Weapon;
              return weaponWithRenamedApi;
            })
          };
          delete regimentWithRenamedWeapons.wor_mapsRegimentWeapons;

          if (regiment.side === 'USA') {
            USA_regiments[regiment.type].push(regimentWithRenamedWeapons);
          } else if (regiment.side === 'CSA') {
            CSA_regiments[regiment.type].push(regimentWithRenamedWeapons);
          }
        });

        return {
          id: map.id,
          name: map.map,
          attacker: map.attacker,
          campaign: map.campaign,
          map_image: 'https://wortool.com/' + map.image,
          USA_artillery: map.usaArty,
          CSA_artillery: map.csaArty,
          youtube_embed: 'https://www.youtube.com/embed/' + map.youtube,
          stratsketch_url: 'https://stratsketch.com/' + map.strat,
          USA_infantry_regiments: USA_regiments.Infantry.length,
          CSA_infantry_regiments: CSA_regiments.Infantry.length,
          USA_artillery_regiments: USA_regiments.Artillery.length,
          CSA_artillery_regiments: CSA_regiments.Artillery.length,
          USA_cavlary_regiments: USA_regiments.Cavalry.length,
          CSA_cavlary_regiments: CSA_regiments.Cavalry.length,
          USA_regiments,
          CSA_regiments
        };
      });

      res.status(200).send(modifiedMaps);
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
      const USA_regiments = { Infantry: [], Artillery: [], Cavalry: [] };
      const CSA_regiments = { Infantry: [], Artillery: [], Cavalry: [] };

      map.wor_mapsRegiments.forEach(regiment => {
        const regimentWithRenamedWeapons = {
          ...regiment.toJSON(),
          regiment_weaponry: regiment.wor_mapsRegimentWeapons.map(weapon => {
            const weaponWithRenamedApi = {
              ...weapon.toJSON(),
              weapon_api: {
                ...weapon.wor_Weapon.toJSON(),
                length: weapon.wor_Weapon.lengthy,
              }
            };
            delete weaponWithRenamedApi.weapon_api.lengthy;
            delete weaponWithRenamedApi.wor_Weapon;
            return weaponWithRenamedApi;
          })
        };
        delete regimentWithRenamedWeapons.wor_mapsRegimentWeapons;

        if (regiment.side === 'USA') {
          USA_regiments[regiment.type].push(regimentWithRenamedWeapons);
        } else if (regiment.side === 'CSA') {
          CSA_regiments[regiment.type].push(regimentWithRenamedWeapons);
        }
      });

      const verboseMap = {
        id: map.id,
        name: map.map,
        attacker: map.attacker,
        campaign: map.campaign,
        map_image: 'https://wortool.com/' + map.image,
        USA_artillery: map.usaArty === "true" || map.usaArty === true,
        CSA_artillery: map.csaArty === "true" || map.csaArty === true,
        youtube_embed: 'https://www.youtube.com/embed/' + map.youtube,
        stratsketch_url: 'https://stratsketch.com/' + map.strat,
        USA_infantry_regiments: USA_regiments.Infantry.length,
        CSA_infantry_regiments: CSA_regiments.Infantry.length,
        USA_artillery_regiments: USA_regiments.Artillery.length,
        CSA_artillery_regiments: CSA_regiments.Artillery.length,
        USA_cavlary_regiments: USA_regiments.Cavalry.length,
        CSA_cavlary_regiments: CSA_regiments.Cavalry.length,
        USA_regiments,
        CSA_regiments
      };

      res.status(200).send(verboseMap);
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
  const mapData = req.body;
  const { wor_mapsRegiments } = mapData; 

  try {
    const result = await db.sequelize.transaction(async (t) => {
      const existingMap = await Map.findByPk(id, { transaction: t });
      if (!existingMap) {
        return res.status(404).send({ message: `Cannot find Map with id=${id}.` });
      }

      await existingMap.update({
        ...mapData,
      }, { transaction: t });

      const existingRegiments = await existingMap.getWor_mapsRegiments({ transaction: t });
      const existingRegimentsIds = existingRegiments.map(regiment => regiment.id);

      const regimentsToKeep = wor_mapsRegiments.filter(regiment => regiment.id).map(regiment => regiment.id);
      const regimentsToDelete = existingRegimentsIds.filter(id => !regimentsToKeep.includes(id));
      await MapsRegiments.destroy({ where: { id: regimentsToDelete }, transaction: t });

      for (const regiment of wor_mapsRegiments) {
        let createdOrUpdatedRegiment;
        if (regiment.id) {
          createdOrUpdatedRegiment = await MapsRegiments.findByPk(regiment.id, { transaction: t });
          await createdOrUpdatedRegiment.update(regiment, { transaction: t });
        } else {
          createdOrUpdatedRegiment = await MapsRegiments.create({
            ...regiment,
            mapId: id,
          }, { transaction: t });
        }

        const regimentId = createdOrUpdatedRegiment.id;
        if (regiment.wor_mapsRegimentWeapons && regiment.wor_mapsRegimentWeapons.length > 0) {
          for (const weapon of regiment.wor_mapsRegimentWeapons) {
            let createdOrUpdatedWeapon;
            if (weapon.id) {
              createdOrUpdatedWeapon = await MapsRegimentWeapons.findByPk(weapon.id, { transaction: t });
              await createdOrUpdatedWeapon.update({ ...weapon, mapsRegimentsId: regimentId }, { transaction: t });
            } else {
              await MapsRegimentWeapons.create({
                ...weapon,
                mapsRegimentsId: regimentId,
                mapId: id,
              }, { transaction: t });
            }
          }
        }
      }

      const updatedMap = await Map.findOne({
        where: { id: id },
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
      }, { transaction: t });

      return updatedMap;
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


// Old API to be replaced... once data is all re-entered...


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