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
