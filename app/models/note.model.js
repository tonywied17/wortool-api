/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\note.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05996\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:50:59 
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
  const Note = sequelize.define("wor_Notes", {
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

  return Note;
};