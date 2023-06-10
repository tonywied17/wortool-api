module.exports = (sequelize, Sequelize) => {
  const DiscordGuild = sequelize.define('DiscordGuild', {
    name: Sequelize.STRING,
    guildId: Sequelize.STRING,
    userId: Sequelize.STRING,
    icon: Sequelize.STRING
  }, {
    freezeTableName: true,
    collate: 'utf8mb4_unicode_ci',
    charset: 'utf8mb4',
  });

  DiscordGuild.associate = (models) => {
    DiscordGuild.belongsToMany(models.DiscordUser, {
      through: 'UserGuild',
      foreignKey: 'guildId',
      otherKey: 'userId'
    });
  };

  return DiscordGuild;
};
