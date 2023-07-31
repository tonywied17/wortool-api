/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\wor.recap.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Sunday July 16th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:09:31 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * WOR Recap Model
 * This model represents the WOR Recap Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const recap = sequelize.define(
    "wor_recap",
    {
      serverName: {
        type: Sequelize.STRING,
        collate: "utf8mb4_unicode_ci",
        charset: "utf8mb4",
      },
      players: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      map: Sequelize.STRING,
      gameMode: Sequelize.STRING,
      area: Sequelize.STRING,
      winner: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      startTime: Sequelize.STRING,
      endTime: Sequelize.STRING,
      usaInFormation: Sequelize.INTEGER,
      usaSkirmishing: Sequelize.INTEGER,
      usaOutOfLine: Sequelize.INTEGER,
      csaInFormation: Sequelize.INTEGER,
      csaSkirmishing: Sequelize.INTEGER,
      csaOutOfLine: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return recap;
};