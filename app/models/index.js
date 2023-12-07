/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\index.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp44517\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 12:18:47 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/**
 * MODELS
 * This is where we import all of our models.
 */
db.maps = require("./map.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.weapon = require("./weapon.model.js")(sequelize, Sequelize);
db.note = require("./note.model.js")(sequelize, Sequelize);
db.favorite = require("./favorite.model.js")(sequelize, Sequelize);
db.discordUser = require("./discord.user.model.js")(sequelize, Sequelize);
db.discordGuild = require("./discord.guild.model.js")(sequelize, Sequelize);
db.regiment = require("./regiment.model.js")(sequelize, Sequelize);
db.recap = require("./wor.recap.model.js")(sequelize, Sequelize);
db.gameid = require("./gameid.model.js")(sequelize, Sequelize);
db.regSchedule = require("./regiment.schedule.model.js")(sequelize, Sequelize);
db.musterUser= require("./muster.user.model.js")(sequelize, Sequelize);


/**
 * ASSOCIATIONS
 * This is where we define our user and role associations because this is how we originally did it and haven't updated it yet.
 */
db.role.belongsToMany(db.user, {
  through: "wor_UserRoles_JUNC",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "wor_UserRoles_JUNC",
  foreignKey: "userId",
  otherKey: "roleId",
});


// A Regiment can have one discord guild
db.regiment.hasOne(db.discordGuild, {
  foreignKey: "regimentId"
})
// db.discordGuild.belongsTo(db.regiment)


// A Regiment can have many users
db.regiment.hasMany(db.user, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
});
// db.user.belongsTo(db.regiment);


// A User can have one discord account
db.user.hasOne(db.discordUser, {
  foreignKey: "userId",
  onDelete: "CASCADE",
})
// db.discordUser.belongsTo(db.user)


// A User can have many favorites
db.user.hasMany(db.favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
// db.favorite.belongsTo(db.user);


// A Map can have many favorites
db.maps.hasMany(db.favorite, {
  foreignKey: "mapId",
  onDelete: "CASCADE",
});
// db.favorite.belongsTo(db.maps);


// A Regiment can have many steam stat users
db.regiment.hasMany(db.gameid, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
})
// db.gameid.belongsTo(db.regiment)


// A user can have many notes
db.user.hasMany(db.note, {
  foreignKey: "userId"
})
// db.note.belongsTo(db.user)


// Maps can have many notes
db.maps.hasMany(db.note, {
  foreignKey: "mapId"
})
// db.note.belongsTo(db.maps)


// A regiment can have many schedules
db.regiment.hasMany(db.regSchedule, {
  foreignKey: "regimentId"
})
// db.regSchedule.belongsTo(db.regiment)

db.regiment.hasMany(db.musterUser, {
  foreignKey: "regimentId"
})
// db.musterUser.belongsTo(db.regiment)

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
