/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\regschedule.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday August 1st 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:58:45 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Regiment Schedule Model
 * 
 * This model represents the Regiment Schedule Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const RegSchedule = sequelize.define("wor_RegSchedules", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        schedule_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        region_tz: {
            type: Sequelize.STRING,
            allowNull: true,
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
    },{
        freezeTableName: true
    });

    return RegSchedule;
};
