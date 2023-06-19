module.exports = (sequelize, Sequelize) => {
  const DiscordUser = sequelize.define(
    "DiscordUser",
    {
      username: {
        type: Sequelize.STRING,
        collate: "utf8mb4_unicode_ci",
        charset: "utf8mb4",
      },
      discordId: Sequelize.STRING,
      userId: Sequelize.STRING,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
    },
    {
      freezeTableName: true,
    }
  );

  DiscordUser.associate = (models) => {
    DiscordUser.belongsToMany(models.DiscordGuild, {
      through: "UserGuild",
      foreignKey: "discordId",
      otherKey: "guildId",
    });
    DiscordUser.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return DiscordUser;
};
