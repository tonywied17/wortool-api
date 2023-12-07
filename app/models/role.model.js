/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\role.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05136\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:51:23 
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
