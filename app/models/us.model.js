module.exports = (sequelize, Sequelize) => {
  const us = sequelize.define("usUpcoming", {
    day: Sequelize.STRING,
    type: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return us;
};
