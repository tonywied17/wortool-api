/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\index.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp12402\public_html\api.wortool.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri December 8th 2023 12:13:14 
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
db.Maps = require("./map.model.js")(sequelize, Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.Weapon = require("./weapon.model.js")(sequelize, Sequelize);
db.Note = require("./note.model.js")(sequelize, Sequelize);
db.Favorite = require("./favorite.model.js")(sequelize, Sequelize);
db.DiscordUser = require("./discord.user.model.js")(sequelize, Sequelize);
db.DiscordGuild = require("./discord.guild.model.js")(sequelize, Sequelize);
db.Regiment = require("./regiment.model.js")(sequelize, Sequelize);
db.Recap = require("./wor.recap.model.js")(sequelize, Sequelize);
db.SteamUser = require("./steam.user.model.js")(sequelize, Sequelize);
db.RegSchedule = require("./regiment.schedule.model.js")(sequelize, Sequelize);
db.MusterUser= require("./muster.user.model.js")(sequelize, Sequelize);


/**
 * ASSOCIATIONS
 * This is where we define our user and role associations because this is how we originally did it and haven't updated it yet.
 */
db.Role.belongsToMany(db.User, {
  through: "wor_UserRoles_JUNC",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.User.belongsToMany(db.Role, {
  through: "wor_UserRoles_JUNC",
  foreignKey: "userId",
  otherKey: "roleId",
});


// A Regiment can have one discord guild
db.Regiment.hasOne(db.DiscordGuild, {
  foreignKey: "regimentId"
})
db.DiscordGuild.belongsTo(db.Regiment)


// A Regiment can have many users
db.Regiment.hasMany(db.User, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
});
db.User.belongsTo(db.Regiment);


// A User can have one discord account
db.User.hasOne(db.DiscordUser, {
  foreignKey: "userId",
  onDelete: "CASCADE",
})
db.DiscordUser.belongsTo(db.User)


// A User can have many favorites
db.User.hasMany(db.Favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.Favorite.belongsTo(db.User);


// A Map can have many favorites
db.Maps.hasMany(db.Favorite, {
  foreignKey: "mapId",
  onDelete: "CASCADE",
});
db.Favorite.belongsTo(db.Maps);


// A Regiment can have many steam stat users
db.Regiment.hasMany(db.SteamUser, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
})
db.SteamUser.belongsTo(db.Regiment)


// A user can have many notes
db.User.hasMany(db.Note, {
  foreignKey: "userId"
})
db.Note.belongsTo(db.User)


// Maps can have many notes
db.Maps.hasMany(db.Note, {
  foreignKey: "mapId"
})
db.Note.belongsTo(db.Maps)


// A regiment can have many schedules
db.Regiment.hasMany(db.RegSchedule, {
  foreignKey: "regimentId"
})
db.RegSchedule.belongsTo(db.Regiment)

db.Regiment.hasMany(db.MusterUser, {
  foreignKey: "regimentId"
})
db.MusterUser.belongsTo(db.Regiment)

db.RoleS = ["user", "admin", "moderator"];

module.exports = db;
