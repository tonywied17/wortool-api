module.exports = (sequelize, Sequelize) => {
    const SteamID = sequelize.define(
      "steamids",
      {
        name: {
          type: Sequelize.STRING,
        },
        idSteam: {
          type: Sequelize.STRING,
        },
      },
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
  
    return SteamID;
  };
  