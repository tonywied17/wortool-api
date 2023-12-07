/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\index.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Sat November 18th 2023 11:12:41 
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
db.gallery = require("./gallery.model.js")(sequelize, Sequelize);
db.eu = require("./eu.model.js")(sequelize, Sequelize);
db.us = require("./us.model.js")(sequelize, Sequelize);
db.score = require("./score.model.js")(sequelize, Sequelize);
db.muster = require("./muster.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.weapon = require("./weapon.model.js")(sequelize, Sequelize);
db.note = require("./note.model.js")(sequelize, Sequelize);
db.favorite = require("./favorite.model.js")(sequelize, Sequelize);
db.discordUser = require("./discord.user.model.js")(sequelize, Sequelize);
db.discordGuild = require("./discord.guild.model.js")(sequelize, Sequelize);
db.steamid = require("./steamid.model.js")(sequelize, Sequelize);
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
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
  constraints: false,
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
  constraints: false,
});


db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
