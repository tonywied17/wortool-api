require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });
//require('dotenv').config()

module.exports = {

  secret: process.env.AUTH_SECRET,

};

