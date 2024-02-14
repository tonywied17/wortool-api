module.exports = (sequelize, Sequelize) => {
  const Units = sequelize.define(
    "wor_mapsRegimentWeapons",
    {
      unitWeaponId: Sequelize.INTEGER
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Units;
};
