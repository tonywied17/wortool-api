/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\discord.routes.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu February 22nd 2024 7:24:30 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const discordController = require("../controllers/discord.controller");
const passport = require('passport');

/**
 *  Discord Routes
 * @param {*} app 
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // ! GET Routes //

  /**
   * Get All Guild Channels
   * @route GET /v2/discord/guild/:id/channels
   * @group Discord
   * @returns {object} 200 - An object containing the channels for the guild
   */
  app.get("/v2/discord/guild/:id/channels", discordController.findGuildChannels);

  /**
   * Get discord users by role in a guild
   */
  app.get("/v2/discord/guild/:guildId/roles/users", discordController.findDiscordUsersByGuildRole)

  /**
   * Get discord guilds list of roles
   */
  app.get("/v2/discord/guild/:guildId/roles", discordController.findDiscordGuildRoles)
  

  /**
   * Get All Discord Synced Users
   * @route GET /v2/users
   * @group Discord
   * @returns {object} 200 - An object containing the users for the guild
   */
  app.get("/v2/discord/users", discordController.findAll);

  /**
   * Get A Single User By ID
   * @route GET /v2/discord/user/:userId
   * @group Discord
   * @returns {object} 200 - An object containing the user
   */
  app.get("/v2/discord/user/:userId", discordController.findOne);

  /**
   * Get A Single User By ID and Guild ID
   * @route GET /v2/discord/user/:userId
   * @group Discord
   * @returns {object} 200 - An object containing the user for the guild
   */
  app.get("/v2/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);

  /**
   * Message a Channel on Discord by Guild ID and Channel ID
   * @route GET /v2/discord/guild/:guildId/channel/:channelId/msg
   * @group Discord
   */
  app.get("/v2/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  
  /**
   * Get a Single Guild by ID
   * @route GET /v2/discord/guild/:id/get
   * @group Discord
   * @returns {object} 200 - An object containing the guild
   */
  app.get("/v2/discord/guild/:id/get", discordController.findOneGuild);
  

  /**
   * Get the Guild's Webhook by Guild ID and Channel ID
   * @route GET /v2/discord/guild/:guildId/channel/:channelId/webhook
   * @group Discord
   * @returns {object} 200 - An object containing the guild's webhook
   */
  app.get("/v2/discord/guild/:guildId/channel/:channelId/webhook", discordController.createWebhook);


  // ! DELETE Routes //

  /**
   * Delete a Single User by ID
   * @route DELETE /v2/discord/user/:userId/remove
   * @group Discord
   * @returns {object} 200 - An object containing the user
   */
  app.delete(
    "/v2/discord/user/:userId/remove",
    discordController.deleteOneUser
  )


  // ! OAUTH2 Routes //

  /**
   * Discord OAuth2
   * @route GET /v2/discord/auth/
   * @group Discord
   */
  app.get('/v2/discord/auth/', (req, res, next) => {
    const userId = req.query.state;
    const state = encodeURIComponent(JSON.stringify({ userId }));
    passport.authenticate('discord', { state })(req, res, next);
  });
  

  app.get('/v2/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/auth'
  }), (req, res) => {
    res.send(`
      <script>
        window.opener.postMessage('authSuccess', '*');
        window.close();
      </script>
    `);
  });

};
