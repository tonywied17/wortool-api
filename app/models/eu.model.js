module.exports = (sequelize, Sequelize) => {
  const eu = sequelize.define(
    "euUpcoming",
    {
      day: Sequelize.STRING,
      type: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return eu;
};
