require('dotenv').config({ path: '/home/tonewebdesign/envs/pa/.env' });
//require('dotenv').config()
module.exports = {
  secret: process.env.AUTH_SECRET,
};
