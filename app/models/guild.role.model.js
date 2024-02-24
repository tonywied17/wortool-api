/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\models\guild.role.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:56:39 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * GuildRole Model
 * This model represents the Guild Roles Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - GuildRole
 */
module.exports = (sequelize, Sequelize) => {
    const GuildRole = sequelize.define("wor_GuildRoles", {
        roleId: {
            type: Sequelize.STRING,
        },
        roleName: {
            type: Sequelize.STRING,
        },
        guildId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'wor_Regiments', 
                key: 'guild_id',
            }
        }
    }, {
        freezeTableName: true
    });

    return GuildRole;
};
