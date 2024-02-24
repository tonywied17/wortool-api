/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\user.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 6:30:42 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

/**
 * Authorize Public Access
 * This function is used to authorize public access
 *
 * @param {*} req
 * @param {*} res - boolean based on public access
 */
exports.allAccess = (req, res) => {
  res.status(200).json({ access: true });
};

/**
 * Authorize User Access
 * This function is used to authorize user access
 *
 * @param {*} req
 * @param {*} res - boolean based on user access
 */
exports.userBoard = (req, res) => {
  res.status(200).json({ access: true });
};

/**
 * Authorize Admin Access
 * This function is used to authorize admin access
 *
 * @param {*} req
 * @param {*} res - boolean based on admin access
 */
exports.adminBoard = (req, res) => {
  res.status(200).json({ access: true });
};

/**
 * Authorize Moderator Access
 * This function is used to authorize moderator access
 *
 * @param {*} req
 * @param {*} res - boolean based on moderator access
 */
exports.moderatorBoard = (req, res) => {
  res.status(200).json({ access: true });
};
