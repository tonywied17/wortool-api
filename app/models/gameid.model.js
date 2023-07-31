/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\gameid.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Thursday July 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:06:22 
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
    const GameID = sequelize.define("gameids", {
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

    /**
     * Associate GameID with Regiment
     * @param {*} models 
     */
    GameID.associate = (models) => {
        GameID.belongsTo(models.Regiment, {
            foreignKey: "regimentId",
            onDelete: "CASCADE",
        });
    };

    return GameID;
};