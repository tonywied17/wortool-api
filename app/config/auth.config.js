/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\config\auth.config.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 7:04:33 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });


module.exports = {

  secret: process.env.AUTH_SECRET,

};

