/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\map.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05366\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:50:51 
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
    "wor_Maps",
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
      freezeTableName: true
    }
  );


  return Map;
};
