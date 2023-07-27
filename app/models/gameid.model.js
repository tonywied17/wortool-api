module.exports = (sequelize, Sequelize) => {
    const GameID = sequelize.define("gameids", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nickname: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        steamId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        regimentId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    });

    GameID.associate = (models) => {
        GameID.belongsTo(models.Regiment, {
            foreignKey: "regimentId",
            onDelete: "CASCADE",
        });
    };

    return GameID;
};