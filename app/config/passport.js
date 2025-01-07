/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\config\passport.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 7:04:33 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const db = require('../models'); 
const User = db.User;
const DiscordUser = db.DiscordUser;
require("dotenv").config({ path: "/home/wortool/envs/wor/.env" });


/**
 * Serialize user
 * @param {*} user - The user object
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialize user
 * @param {*} id - The user id
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

/**
 * Passport Discord Strategy
 * This strategy is used to authenticate users using their Discord account.
 * It is used to link a Discord account to an existing user account.
 * @param {*} req - The request object
 * @param {*} accessToken - The access token
 * @param {*} refreshToken - The refresh token
 * @param {*} profile - The user's Discord profile
 * @param {*} done - The callback function
 */
passport.use(new DiscordStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://api.wortool.com/v2/discord/callback',
  scope: ['identify', 'email'],
  passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
  try {
    const { userId } = JSON.parse(decodeURIComponent(req.query.state));

    const existingUser = await User.findOne({ where: { id: userId } });
    if (!existingUser) {
      return done(null, false, { message: 'User not found.' });
    }

    let discordUser = await DiscordUser.findOne({ where: { discordId: profile.id } });

    if (discordUser) {
      if (discordUser.userId !== userId) {
        discordUser.userId = userId;
        discordUser.email = profile.email;
        discordUser.avatar = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
        await discordUser.save();
      }
    } else {
      discordUser = await DiscordUser.create({
        username: profile.username,
        discordId: profile.id,
        userId: userId,
        email: profile.email,
        avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
      });
    }

    existingUser.discordId = profile.id;
    existingUser.avatar_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
    await existingUser.save();


    return done(null, discordUser);
  } catch (error) {
    return done(error);
  }
}));

