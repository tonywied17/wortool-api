/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\models\score.model.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Mon July 31st 2023 4:07:18 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Score Model
 * This model represents the Score Table in the database.
 * 
 * @param {*} sequelize 
 * @param {*} Sequelize 
 * @returns - Score
 */
module.exports = (sequelize, Sequelize) => {
  const score = sequelize.define(
    "topScores",
    {
      rifle: Sequelize.STRING,
      nickname: Sequelize.STRING,
      timestamp: Sequelize.STRING,
      score: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return score;
};
