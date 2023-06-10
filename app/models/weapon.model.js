module.exports = (sequelize, Sequelize) => {
  const Weapon = sequelize.define("weapons", {
    weapon: Sequelize.STRING,
    range: Sequelize.INTEGER,
    lengthy: Sequelize.INTEGER,
    ammo: Sequelize.STRING,
    notes: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Weapon;
};
