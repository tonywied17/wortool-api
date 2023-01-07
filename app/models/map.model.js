module.exports = (sequelize, Sequelize) => {
  const Map = sequelize.define("maps", {
    map: Sequelize.STRING,
    image: Sequelize.STRING,
    usaArty: Sequelize.STRING,
    csaArty: Sequelize.STRING,
    campaign: Sequelize.STRING,
    youtube: Sequelize.STRING,
    strat: Sequelize.STRING,
    notes: Sequelize.TEXT
  },{
    timestamps: false
  })

  return Map;
};
