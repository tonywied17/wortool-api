/*
 * File: c:\Users\tonyw\Desktop\WoRApi\wortool-api\app\models\regiment.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Thursday December 7th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 5:34:54 
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
