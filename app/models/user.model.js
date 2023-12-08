/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\user.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 12:11:10 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * User Model
 * This model represents the User Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - User 
 */
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("wor_Users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    avatar_url: {
      type: Sequelize.STRING,
    },
    discordId: {
      type: Sequelize.STRING,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
    },
  },{
    freezeTableName: true
});


  return User;
};
