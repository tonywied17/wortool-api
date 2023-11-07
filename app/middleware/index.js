/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\middleware\index.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue November 7th 2023 12:11:15 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignup");
const upload = require("./upload");

module.exports = {
  authJwt,
  verifySignUp,
  upload
};
