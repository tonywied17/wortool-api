/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\weapon.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:35:10 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Weapon Model
 * This model represents the Weapon Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const Weapon = sequelize.define(
    "wor_Weapons",
    {
      weapon: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      range: {
        type: Sequelize.STRING,
      },
      lengthy: {
        type: Sequelize.STRING,
      },
      ammo: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Weapon;
};
