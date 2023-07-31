/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\user.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:09:04 
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
  const User = sequelize.define("users", {
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
    regimentId: {
      type: Sequelize.INTEGER,
    },
  });

  /**
   * Associate User with Notes and Favorites
   * @param {*} models
   */
  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Favorite, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasOne(models.DiscordUser, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasOne(models.Regiment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

  };

  return User;
};
