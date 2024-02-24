/*
 * File: c:\Users\tonyw\Desktop\WoRApi\wortool-api\app\models\steam.user.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday December 7th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:59:14 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 MolexWorks / Tone Web Design
 */

/**
 * GameID Model
 * 
 * This model represents the GameID Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const GameID = sequelize.define("wor_SteamUsers", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nickname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        steamId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });


    return GameID;
};