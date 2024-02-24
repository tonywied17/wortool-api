/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\models\maps.regiments.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:58:08 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * MapsRegiments Model
 * 
 * This model represents the MapsRegiments Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const MapsRegiments = sequelize.define(
      "wor_mapsRegiments",
      {
        name: Sequelize.STRING,
        side: Sequelize.STRING,
        type: Sequelize.STRING,
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
  
    return MapsRegiments;
  };
  