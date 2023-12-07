/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\regiment.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05376\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:51:04 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
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
