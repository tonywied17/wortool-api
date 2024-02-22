// models/guild.channel.model.js

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
