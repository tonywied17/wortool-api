/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\config\auth.config.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Tue August 1st 2023 10:20:01 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

// require("dotenv").config({ path: "/home/tonewebdesign/envs/pa/.env" });
require('dotenv').config()
module.exports = {
  secret: process.env.AUTH_SECRET,
};
