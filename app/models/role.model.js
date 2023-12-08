/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\role.model.js
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
 * Role Model
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Role
 */
module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("wor_Roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  },{
    freezeTableName: true
});

  return Role;
};
