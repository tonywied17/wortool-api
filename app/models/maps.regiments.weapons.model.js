/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\models\maps.regiments.weapons.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:58:04 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * MapsRegimentWeapons Model
 * 
 * This model represents the MapsRegimentWeapons Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const MapsRegimentWeapons = sequelize.define(
    "wor_mapsRegimentWeapons",
    {
      unitWeaponId: Sequelize.INTEGER
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return MapsRegimentWeapons;
};
