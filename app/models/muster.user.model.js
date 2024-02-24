/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\models\muster.user.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:58:28 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * Muster User Model
 * 
 * This model represents the MusterUser Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const MusterUser = sequelize.define(
      "wor_MusterUser",
      {
        nickname: {
            type: Sequelize.STRING,
        },
        discordId: {
            type: Sequelize.STRING,
        },
        events: {
            type: Sequelize.INTEGER,
        },
        drills: {
            type: Sequelize.INTEGER,
        },
        join_date: {
            type: Sequelize.STRING,
        },
        last_muster: {
            type: Sequelize.STRING,
        },
        order_by: {
            type: Sequelize.INTEGER,
        },
      },
        
      {
        freezeTableName: true,
        timestamps: false,
      }
    );


    return MusterUser;
  };
  