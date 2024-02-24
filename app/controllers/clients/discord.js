/*
 * File: c:\Users\tonyw\Desktop\WoRTool API\wortool-api\app\controllers\clients\discord.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Thursday February 22nd 2024
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 7:04:33 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2024 MolexWorks / Tone Web Design
 */

const { Client, GatewayIntentBits } = require('discord.js');
require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });



const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
  ],
});

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
