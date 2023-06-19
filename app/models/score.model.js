module.exports = (sequelize, Sequelize) => {
  const score = sequelize.define(
    "topScores",
    {
      rifle: Sequelize.STRING,
      nickname: Sequelize.STRING,
      timestamp: Sequelize.STRING,
      score: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return score;
};
