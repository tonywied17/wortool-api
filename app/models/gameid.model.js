/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\gameid.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05809\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Thursday July 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:51:31 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * GameID Model
 * This model represents the GameID Table in the database.
 * 
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
        regimentId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });


    return GameID;
};