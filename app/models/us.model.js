/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\us.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:07:47 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * US Schedule Model
 * This model represents the US Schedule Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - US Schedule
 */
module.exports = (sequelize, Sequelize) => {
  const us = sequelize.define(
    "usUpcoming",
    {
      day: Sequelize.STRING,
      type: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return us;
};
