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
    regimentId: {
      type: Sequelize.INTEGER,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasMany(models.Favorite, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasOne(models.DiscordUser, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

    User.hasOne(models.Regiment, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });

  };

  return User;
};
