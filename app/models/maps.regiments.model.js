
module.exports = (sequelize, Sequelize) => {
    const MapsRegiments = sequelize.define(
      "wor_mapsRegiments",
      {
        name: Sequelize.STRING,
        side: Sequelize.STRING,
        type: Sequelize.STRING,
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
  
    return MapsRegiments;
  };
  