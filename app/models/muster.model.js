/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\muster.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:06:07 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Muster Model
 * This model represents the Muster Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Muster
 */
module.exports = (sequelize, Sequelize) => {
  const Muster = sequelize.define(
    "muster",
    {
      discordID: Sequelize.STRING,
      regiment: Sequelize.STRING,
      nickname: Sequelize.STRING,
      events: Sequelize.INTEGER,
      drills: Sequelize.INTEGER,
      joindate: Sequelize.STRING,
      lastmuster: Sequelize.STRING,
      orderby: Sequelize.INTEGER,
      rankrole: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Muster;
};
