/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\role.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:59:06 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Role Model (Website Users)
 * 
 * This model represents the Role Table in the database.
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
