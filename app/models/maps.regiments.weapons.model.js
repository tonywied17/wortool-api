module.exports = (sequelize, Sequelize) => {
  const MapsRegimentWeapons = sequelize.define(
    "wor_mapsRegimentWeapons",
    {
      unitWeaponId: Sequelize.INTEGER
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return MapsRegimentWeapons;
};
