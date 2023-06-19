module.exports = (sequelize, Sequelize) => {
  const Muster = sequelize.define(
    "muster",
    {
      discordID: Sequelize.STRING,
      regiment: Sequelize.STRING,
      nickname: Sequelize.STRING,
      events: Sequelize.INTEGER,
      drills: Sequelize.INTEGER,
      joindate: Sequelize.STRING,
      lastmuster: Sequelize.STRING,
      orderby: Sequelize.INTEGER,
      rankrole: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Muster;
};
