module.exports = (sequelize, Sequelize) => {
    const Favorite = sequelize.define("favorites", {
      route: {
        type: Sequelize.STRING,
      }, 
      type: {
        type: Sequelize.STRING,
      },
      mapId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
    });
  
    // Define associations
    Favorite.associate = (models) => {
      Favorite.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    Favorite.belongsTo(models.Map, {
        foreignKey: 'mapId',
        onDelete: 'CASCADE'
      });
    };
  
    return Favorite;
  };
  