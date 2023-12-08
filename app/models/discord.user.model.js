/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\discord.user.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 12:11:24 
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
    "wor_DiscordUser",
    {
      username: {
        type: Sequelize.STRING,
        collate: "utf8mb4_unicode_ci",
        charset: "utf8mb4",
      },
      discordId: Sequelize.INTEGER,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );

  return DiscordUser;
};
