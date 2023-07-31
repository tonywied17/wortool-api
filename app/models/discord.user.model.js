/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\discord.user.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:02:15 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Discord User Model
 * This model represents the Discord User Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Discord User Model
 */
module.exports = (sequelize, Sequelize) => {
  const DiscordUser = sequelize.define(
    "DiscordUser",
    {
      username: {
        type: Sequelize.STRING,
        collate: "utf8mb4_unicode_ci",
        charset: "utf8mb4",
      },
      discordId: Sequelize.STRING,
      userId: Sequelize.STRING,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );

  /**
   * Associate Discord User with Discord Guild and User
   * @param {*} models
   */
  DiscordUser.associate = (models) => {
    DiscordUser.belongsToMany(models.DiscordGuild, {
      through: "UserGuild",
      foreignKey: "discordId",
      otherKey: "guildId",
    });
    DiscordUser.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return DiscordUser;
};
