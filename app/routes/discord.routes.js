/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\routes\discord.routes.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Sat August 12th 2023 12:09:59 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const discordController = require("../controllers/discord.controller");

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
   * @route GET /pa/discord/guild/:id/channels
   * @group Discord
   * @returns {object} 200 - An object containing the channels for the guild
   */
  app.get("/pa/discord/guild/:id/channels", discordController.findGuildChannels);

  /**
   * Get All Guild Users
   * @route GET /pa/discord/guild/:id/users
   * @group Discord
   * @returns {object} 200 - An object containing the users for the guild
   */
  app.get("/pa/discord/users", discordController.findAll);

  /**
   * Get A Single User By ID
   * @route GET /pa/discord/user/:userId
   * @group Discord
   * @returns {object} 200 - An object containing the user
   */
  app.get("/pa/discord/user/:userId", discordController.findOne);

  /**
   * Get A Single User By ID and Guild ID
   * @route GET /pa/discord/user/:userId
   * @group Discord
   * @returns {object} 200 - An object containing the user for the guild
   */
  app.get("/pa/discord/guild/:guildId/user/:userId/get", discordController.findOneUser);

  /**
   * Message a Channel on Discord by Guild ID and Channel ID
   * @route GET /pa/discord/guild/:guildId/channel/:channelId/msg
   * @group Discord
   */
  app.get("/pa/discord/guild/:guildId/channel/:channelId/msg/:msg/get", discordController.sendOneMsg);
  
  /**
   * Get a Single Guild by ID
   * @route GET /pa/discord/guild/:id/get
   * @group Discord
   * @returns {object} 200 - An object containing the guild
   */
  app.get("/pa/discord/guild/:id/get", discordController.findOneGuild);
  

  /**
   * Get the Guild's Webhook by Guild ID and Channel ID
   * @route GET /pa/discord/guild/:guildId/channel/:channelId/webhook
   * @group Discord
   * @returns {object} 200 - An object containing the guild's webhook
   */
  app.get("/pa/discord/guild/:guildId/channel/:channelId/webhook", discordController.createWebhook);


  // ! DELETE Routes //

  /**
   * Delete a Single User by ID
   * @route DELETE /pa/discord/user/:userId/remove
   * @group Discord
   * @returns {object} 200 - An object containing the user
   */
  app.delete(
    "/pa/discord/user/:userId/remove",
    discordController.deleteOneUser
  )


  // ! OAUTH2 Routes //

  /**
   * Discord OAuth2
   * @route GET /pa/discord/auth/
   * @group Discord
   */
  app.get('/pa/discord/auth/', discordController.auth);
  
  /**
   * Discord OAuth2 Callback
   * @route GET /pa/discord/callback/
   * @group Discord
   * @param state - The state parameter that was passed to the OAuth URL
   */
  app.get('/pa/discord/', (req, res) => {
    const state = req.query.state;
  
    res.send(`
      <script>
        // Automatically redirect to the OAuth URL with the state parameter
        window.location.href = "${process.env.OAUTH_URL}&state=${state}";
      </script>
    `);
  });


};
