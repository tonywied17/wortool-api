/**
 * Muster User Model
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
    const MusterUser = sequelize.define(
      "MusterUser",
      {
        nickname: {
            type: Sequelize.STRING,
        },
        discordId: {
            type: Sequelize.STRING,
        },
        regimentId: {
            type: Sequelize.INTEGER,
        },
        events: {
            type: Sequelize.INTEGER,
        },
        drills: {
            type: Sequelize.INTEGER,
        },
        join_date: {
            type: Sequelize.STRING,
        },
        last_muster: {
            type: Sequelize.STRING,
        },
        order_by: {
            type: Sequelize.INTEGER,
        },
      },
        
      {
        freezeTableName: true,
        timestamps: false,
      }
    );
  
    /**
     * Associate GameID with Regiment
     * @param {*} models 
     */
    MusterUser.associate = (models) => {
        MusterUser.belongsTo(models.Regiment, {
            foreignKey: "regimentId",
            onDelete: "CASCADE",
        });

        models.Regiment.hasMany(MusterUser, {
            foreignKey: "regimentId",
        });
    };

    return MusterUser;
  };
  