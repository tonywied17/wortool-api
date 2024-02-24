/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\favorite.model.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 5:58:12 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Favorite Model
 * This model represents the Favorite Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns 
 */
module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("wor_Favorites", {
    route: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
  },{
    freezeTableName: true
});


  return Favorite;
};
