module.exports = (sequelize, Sequelize) => {
  const Gallery = sequelize.define("gallery", {
    url: Sequelize.STRING,
    type: Sequelize.STRING,
  }, {
    freezeTableName: true,
    timestamps: false
  })

  return Gallery;
};
