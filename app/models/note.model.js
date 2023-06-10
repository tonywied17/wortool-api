module.exports = (sequelize, Sequelize) => {
  const Note = sequelize.define("notes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mapId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false
    }
  });

  Note.associate = (models) => {
    Note.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Note.belongsTo(models.Map, {
      foreignKey: 'mapId',
      onDelete: 'CASCADE'
    });
  };

  return Note;
};
