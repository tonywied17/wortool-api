/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\models\guild.channel.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:56:28 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

/**
 * Guild Channel Model
 * This model represents the Guild Channel Table in the database.
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const GuildChannel = sequelize.define("wor_GuildChannels", {
        channelId: {
            type: Sequelize.STRING,
        },
        channelName: {
            type: Sequelize.STRING,
        },
        channelType: {
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

    return GuildChannel;
};
