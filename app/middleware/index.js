/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\middleware\index.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed October 11th 2023 3:57:26 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignup");

module.exports = {
  authJwt,
  verifySignUp
};
