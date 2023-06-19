module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    avatar_url: {
      type: Sequelize.STRING,
    },
    discordId: {
      type: Sequelize.STRING,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  User.associate = (models) => {
    User.hasMany(models.Favorite, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  User.associate = (models) => {
    User.hasOne(models.DiscordUser, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return User;
};
