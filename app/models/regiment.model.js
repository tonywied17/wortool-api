/*
 * File: c:\Users\tonyw\Desktop\WoRApi\wortool-api\app\models\regiment.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp13881\public_html\api.wortool.com\wor-api\app\models
 * Created Date: Thursday December 7th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue February 13th 2024 11:15:28 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 MolexWorks / Tone Web Design
 */


/**
 * Regiment Model
 * This model represents the Regiment Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Regiment
 */
module.exports = (sequelize, Sequelize) => {
  const Regiment = sequelize.define("wor_Regiments", {
    regiment: {
      type: Sequelize.STRING,
    },
    guild_id: {
      type: Sequelize.STRING,
    },
    guild_avatar: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    invite_link: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    youtube: {
      type: Sequelize.STRING,
    },
    cover_photo: {
      type: Sequelize.STRING,
    },
    webhook: {
      type: Sequelize.STRING,
    },
    webhook_channel: {
      type: Sequelize.STRING,
    },
    webhook_mention: {
      type: Sequelize.STRING,
    },
    ownerId: {
      type: Sequelize.STRING,
    },
    side: {
      type: Sequelize.STRING,
    },
    memberCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  },{
    freezeTableName: true
});

  return Regiment;
};
