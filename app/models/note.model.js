/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\note.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:06:02 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Note Model
 * This model represents the Note Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define("notes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mapId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  /**
   * Associate Note with User and Map
   * @param {*} models 
   */
  Note.associate = (models) => {
    Note.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Note.belongsTo(models.Map, {
      foreignKey: "mapId",
      onDelete: "CASCADE",
    });
  };

  return Note;
};