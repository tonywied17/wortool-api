/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\favorite.model.js
 * Project: c:\Users\tonyw\Desktop\WoRApi\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu December 7th 2023 12:11:12 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Favorite Model
 * This model represents the Favorite Table in the database.
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
