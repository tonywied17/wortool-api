/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\index.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:57:41 
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
 * Import all models
 */
db.Maps = require("./map.model.js")(sequelize, Sequelize);
db.MapsRegimentWeapons = require("./maps.regiments.weapons.model.js")(sequelize, Sequelize);
db.MapsRegiments = require("./maps.regiments.model.js")(sequelize, Sequelize);
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
db.MusterUser = require("./muster.user.model.js")(sequelize, Sequelize);
db.GuildRole = require("./guild.role.model.js")(sequelize, Sequelize);
db.GuildChannel = require("./guild.channel.model.js")(sequelize, Sequelize);

/**
 * Define relationships
 * This is where we define the relationships between the models
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

db.Regiment.hasOne(db.DiscordGuild, {
  foreignKey: "regimentId",
});
db.DiscordGuild.belongsTo(db.Regiment, {
  foreignKey: "regimentId",
});

db.Regiment.hasMany(db.User, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
});
db.User.belongsTo(db.Regiment, {
  foreignKey: "regimentId",
});

db.User.hasOne(db.DiscordUser, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.DiscordUser.belongsTo(db.User, {
  foreignKey: "userId",
});

db.User.hasMany(db.Favorite, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.Favorite.belongsTo(db.User, {
  foreignKey: "userId",
});

db.Maps.hasMany(db.Favorite, {
  foreignKey: "mapId",
  onDelete: "CASCADE",
});
db.Favorite.belongsTo(db.Maps, {
  foreignKey: "mapId",
});

db.Regiment.hasMany(db.SteamUser, {
  foreignKey: "regimentId",
  onDelete: "CASCADE",
});
db.SteamUser.belongsTo(db.Regiment, {
  foreignKey: "regimentId",
});

db.User.hasMany(db.Note, {
  foreignKey: "userId",
});
db.Note.belongsTo(db.User, {
  foreignKey: "userId",
});

db.Maps.hasMany(db.Note, {
  foreignKey: "mapId",
});
db.Note.belongsTo(db.Maps, {
  foreignKey: "mapId",
});

db.Regiment.hasMany(db.RegSchedule, {
  foreignKey: "regimentId",
});
db.RegSchedule.belongsTo(db.Regiment, {
  foreignKey: "regimentId",
});

db.Regiment.hasMany(db.MusterUser, {
  foreignKey: "regimentId",
});
db.MusterUser.belongsTo(db.Regiment, {
  foreignKey: "regimentId",
});

db.Maps.hasMany(db.MapsRegiments, 
  { foreignKey: "mapId" 
});
db.MapsRegiments.belongsTo(db.Maps, 
  { foreignKey: "mapId" 
});

db.MapsRegiments.hasMany(db.MapsRegimentWeapons, {
  foreignKey: "mapsRegimentsId",
});
db.MapsRegimentWeapons.belongsTo(db.MapsRegiments, {
  foreignKey: "mapsRegimentsId",
});

db.MapsRegimentWeapons.belongsTo(db.Weapon, { 
  foreignKey: "unitWeaponId" 
});
db.Weapon.hasMany(db.MapsRegimentWeapons, { 
  foreignKey: "unitWeaponId" 
});

db.MapsRegimentWeapons.belongsTo(db.Maps, { 
  foreignKey: "mapId" 
});
db.Maps.hasMany(db.MapsRegimentWeapons, { 
  foreignKey: "mapId" 
});

db.Regiment.hasMany(db.GuildRole, {
  foreignKey: "guildId",
  as: "roles",
});
db.GuildRole.belongsTo(db.Regiment, {
  foreignKey: "guildId",
  as: "regiment"
});

db.Regiment.hasMany(db.GuildChannel, {
  foreignKey: "guildId",
  as: "channels",
});
db.GuildChannel.belongsTo(db.Regiment, {
  foreignKey: "guildId",
  as: "regiment"
});


db.RoleS = ["user", "admin", "moderator"];

module.exports = db;
