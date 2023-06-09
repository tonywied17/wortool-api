module.exports = (sequelize, Sequelize) => {
  const Map = sequelize.define("maps", {
    map: Sequelize.STRING,
    image: Sequelize.STRING,
    usaArty: Sequelize.STRING,
    csaArty: Sequelize.STRING,
    campaign: Sequelize.STRING,
    youtube: Sequelize.STRING,
    attacker: Sequelize.STRING,
    strat: Sequelize.STRING
  }, {
    timestamps: false
  });

  // Define associations
  Map.associate = (models) => {
    Map.hasMany(models.Note, {
      foreignKey: 'mapId',
      onDelete: 'CASCADE'
    });
  };

  Map.associate = (models) => {
    Map.hasMany(models.Favorite, {
      foreignKey: 'mapId',
      onDelete: 'CASCADE'
    });
  };

  return Map;
};
