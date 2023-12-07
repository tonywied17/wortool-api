/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\discord.guild.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05501\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Sunday July 30th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:51:43 
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
      regimentId: Sequelize.INTEGER,
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



