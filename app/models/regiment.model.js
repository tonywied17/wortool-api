module.exports = (sequelize, Sequelize) => {
  const Regiment = sequelize.define("regiments", {
    regiment: {
      type: Sequelize.STRING,
    },
    guild_id: {
      type: Sequelize.STRING,
    },
    guild_avatar: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    invite_link: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
    webhook: {
      type: Sequelize.STRING,
    },
    webhook_channel: {
      type: Sequelize.STRING,
    },
    ownerId: {
      type: Sequelize.STRING,
    },
    side: {
      type: Sequelize.STRING,
    }
  });

  Regiment.associate = (models) => {
    Regiment.hasMany(models.GameID, {
      foreignKey: "regimentId",
      onDelete: "CASCADE",
    });
  };

  return Regiment;
};
