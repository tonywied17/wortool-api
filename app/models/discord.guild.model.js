/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\discord.guild.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Sunday July 30th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 12:12:18 
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
    "wor_DiscordGuild", {
      name: Sequelize.STRING,
      guildId: Sequelize.STRING,
      icon: Sequelize.STRING,
      prefix: Sequelize.STRING,
    }, {
      freezeTableName: true,
      collate: "utf8mb4_unicode_ci",
      charset: "utf8mb4",
    }
  );

  return DiscordGuild;
};



