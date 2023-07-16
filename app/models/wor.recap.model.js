module.exports = (sequelize, Sequelize) => {
  const recap = sequelize.define(
    "wor_recap",
    {
      serverName: {
        type: Sequelize.STRING,
        collate: "utf8mb4_unicode_ci",
        charset: "utf8mb4",
      },
      players: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      map: Sequelize.STRING,
      gameMode: Sequelize.STRING,
      area: Sequelize.STRING,
      winner: Sequelize.STRING,
      duration: Sequelize.INTEGER,
      startTime: Sequelize.STRING,
      endTime: Sequelize.STRING,
      usaInFormation: Sequelize.INTEGER,
      usaSkirmishing: Sequelize.INTEGER,
      usaOutOfLine: Sequelize.INTEGER,
      csaInFormation: Sequelize.INTEGER,
      csaSkirmishing: Sequelize.INTEGER,
      csaOutOfLine: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return recap;
};