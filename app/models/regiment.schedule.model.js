/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\regschedule.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday August 1st 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue August 1st 2023 11:23:16 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Regiment Schedule Model
 * This model represents the Regiment Schedule Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const RegSchedule = sequelize.define("RegSchedules", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        regimentId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        day: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        event_type: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        event_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    /**
     * Associate Regiment Schedule with Regiment
     * @param {*} models 
     */
    RegSchedule.associate = (models) => {
        RegSchedule.belongsTo(models.Regiment, {
            foreignKey: "regimentId",
            onDelete: "CASCADE",
        });
    };

    return RegSchedule;
};