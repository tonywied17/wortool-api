module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    avatar_url:{
      type: Sequelize.STRING
    },
    discordId:{
      type: Sequelize.STRING
    },
  });

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  return User;
};
