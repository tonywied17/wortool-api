/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\map.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:06:12 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Map Model
 * This model represents the Map Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Map
 */
module.exports = (sequelize, Sequelize) => {
  const Map = sequelize.define(
    "maps",
    {
      map: Sequelize.STRING,
      image: Sequelize.STRING,
      usaArty: Sequelize.STRING,
      csaArty: Sequelize.STRING,
      campaign: Sequelize.STRING,
      youtube: Sequelize.STRING,
      attacker: Sequelize.STRING,
      strat: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );

  /**
   * Associate Map with Note and Favorite
   * @param {*} models 
   */
  Map.associate = (models) => {
    Map.hasMany(models.Note, {
      foreignKey: "mapId",
      onDelete: "CASCADE",
    });
  };

  Map.associate = (models) => {
    Map.hasMany(models.Favorite, {
      foreignKey: "mapId",
      onDelete: "CASCADE",
    });
  };

  return Map;
};
