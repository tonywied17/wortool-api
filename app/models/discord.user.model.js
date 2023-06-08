module.exports = (sequelize, Sequelize) => {
  const DiscordUser = sequelize.define('DiscordUser', {
    username: {
      type: Sequelize.STRING,
      collate: 'utf8mb4_unicode_ci',
      charset: 'utf8mb4'
    },
    userId: Sequelize.STRING,
    email: Sequelize.STRING,
    avatar: Sequelize.STRING,
  }, {
    freezeTableName: true,
  });

  DiscordUser.associate = (models) => {
    DiscordUser.belongsToMany(models.DiscordGuild, {
      through: 'UserGuild',
      foreignKey: 'userId',
      otherKey: 'guildId'
    });
  };

  return DiscordUser;
};
