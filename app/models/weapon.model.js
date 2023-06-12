module.exports = (sequelize, Sequelize) => {
  const Weapon = sequelize.define("weapons", {
    weapon: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    range: {
      type: Sequelize.STRING
    },
    lengthy: {
      type: Sequelize.STRING
    },
    ammo: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    },
    notes: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false
  });

  return Weapon;
};
