/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\discord.guild.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Sunday July 30th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:01:39 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Discord Guild Model
 * This model represents the Discord Guild Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Discord Guild Model
 */
module.exports = (sequelize, Sequelize) => {
  const DiscordGuild = sequelize.define(
    "DiscordGuild", {
      name: Sequelize.STRING,
      guildId: Sequelize.STRING,
      discordId: Sequelize.STRING,
      userId: Sequelize.STRING,
      icon: Sequelize.STRING,
    }, {
      freezeTableName: true,
      collate: "utf8mb4_unicode_ci",
      charset: "utf8mb4",
    }
  );

  /**
   * Associate Discord Guild with Discord User and User
   * @param {*} models 
   */
  DiscordGuild.associate = (models) => {
    DiscordGuild.belongsToMany(models.DiscordUser, {
      through: "UserGuild",
      foreignKey: "guildId",
      otherKey: "discordId",
    });
    DiscordGuild.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return DiscordGuild;
};