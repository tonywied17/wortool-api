/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\favorite.model.js
 * Project: c:\Users\tonyw\AppData\Local\Temp\scp05388\public_html\api.tonewebdesign.com\wor-api\app\models
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 8:51:35 
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
    mapId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
  },{
    freezeTableName: true
});


  return Favorite;
};
