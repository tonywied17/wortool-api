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
    }
  });

  return Regiment;
};
