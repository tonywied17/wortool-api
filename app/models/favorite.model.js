/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\favorite.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:02:59 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Favorite Model
 * This model represents the Favorite Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorites", {
    route: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    mapId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  });

  /**
   * Associate Favorite with User and Map
   * @param {*} models 
   */
  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Favorite.belongsTo(models.Map, {
      foreignKey: "mapId",
      onDelete: "CASCADE",
    });
  };

  return Favorite;
};
