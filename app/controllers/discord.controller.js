/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\discord.controller.js
 * Project: c:\Users\tonyw\Desktop\PA API\express-paarmy-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Wed December 6th 2023 3:10:28 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */

const {
  Client,
  GatewayIntentBits,
  TextChannel,
} = require("discord.js");
const axios = require("axios");
const db = require("../models");
const User = db.user;
const Regiment = db.regiment;
const DiscordUser = db.discordUser;
require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });


/**
 * Create a webhook for a specific guild and channel
 * This function will create a webhook for a specific guild and channel
 * 
 * @param {*} req - request containing the guildId and channelId
 * @param {*} res - response containing the webhook
 */
exports.createWebhook = async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const channelId = req.params.channelId;

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildWebhooks,
      ],
    });

    await client.login(process.env.DISCORD_TOKEN);

    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId);
        const channel = guild.channels.cache.get(channelId);
        console.log('Guild ID:', guildId);
        console.log('Guild Name:', guild.name);
        console.log('Channel Name:', channel.name);

        const webhook = await channel.createWebhook({
          name: 'Server Info',
          avatar: 'https://app.paarmy.com/assets/boticon.png',
        });

        console.log('Webhook created:');
        console.log(`ID: ${webhook.id}`);
        const webhookURL = `https://discord.com/api/webhooks/${webhook.id}/${webhook.token}`;
        console.log(`URL: ${webhookURL}`);

        // Update the Regiment model with the webhookURL and webhook_channel
        await Regiment.update({
          webhook: webhookURL,
          webhook_channel: channel.name
        }, {
          where: {
            guild_id: guildId
          }
        });

        res.json({
          webhook: webhookURL
        });

        client.destroy();
      } catch (error) {
        console.error('Error creating webhook:', error);
        res.status(500).json({
          error: 'Failed to create webhook.'
        });
        client.destroy();
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      error: 'Failed to login.'
    });
  }
};


/**
 * Find a single guild
 * This function will find a single guild based on the request id
 * 
 * @param {*} req - request containing the guildId
 * @param {*} res - response containing the guild record
 */
exports.findOneGuild = (req, res) => {
  const id = req.params.id;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  client.login(process.env.DISCORD_TOKEN);

  client.on('ready', () => {
    const guild = client.guilds.cache.get(id);

    res.json({
      guild: guild
    });

    client.destroy();
  });
}

/**
 * Find all guild channels
 * This function will find all guild channels based on the request id
 * 
 * @param {*} req - request containing the guildId
 * @param {*} res - response containing the guild channels
 */
exports.findGuildChannels = (req, res) => {
  const id = req.params.id;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });

  client.login(process.env.DISCORD_TOKEN);
  client.on("ready", async () => {
    try {
      const discordServer = await client.guilds.fetch(id);

      console.log("Guild ID:", discordServer.id);
      console.log("Guild Name:", discordServer.name);

      const guild = client.guilds.cache.get(id);

      // Filter channels to include only text channels
      // https://discord.com/developers/docs/resources/channel#channel-object-channel-types
      const textChannels = guild.channels.cache.filter(channel => channel.type === 0);

      const channelData = textChannels.map(channel => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      })).sort((a, b) => a.name.localeCompare(b.name));
      channelData.size = textChannels.size;

      res.json({
        channels: channelData,
      });

      client.destroy();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Failed to fetch guild text channels.",
      });
    }
  });
};


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.findOne = async (req, res) => {
  try {
    const userId = req.params.userId;

    const discordUser = await DiscordUser.findOne({
      where: {
        userId: userId,
      },
    });

    if (!discordUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.json(discordUser);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const discordUsers = await DiscordUser.findAll();

    return res.json(discordUsers);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

exports.sendOneMsg = (req, res) => {
  const msg = req.params.msg;
  const guildId = req.params.guildId;
  const channelId = req.params.channelId;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
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

  client.on("ready", () => {
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);

    if (channel instanceof TextChannel) {
      channel.send(msg);
    }
    res.json({
      message: "Message sent!",
      msg: msg,
      guildId: guildId,
      channelId: channelId,
    });

    setTimeout(() => {
      client.destroy();
    }, 10000);
  });
};

exports.findDiscordGuildRoles = async (req, res) => {
  try{
    const guildId = req.params.guildId;

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
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

    await client.login(process.env.DISCORD_TOKEN);

    client.on('ready', () => {
      const guild = client.guilds.cache.get(guildId);

      if (guild) {
       
        const rolesArray = guild.roles.cache.map(role => ({
          id: role.id,
          name: role.name,
          color: role.color,
          // permissions: role.permissions.toArray(),
        }));
    
        res.json(rolesArray);


      } else {
        console.error('Guild not found');
        res.status(404).json({ error: 'Guild not found' });
      }
    });

  }catch (error){
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.findDiscordUsersByGuildRole = async (req, res) => {
  try {
    const guildId = req.params.guildId;
    const roleName = req.query.roleName;

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
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

    await client.login(process.env.DISCORD_TOKEN);

    client.on('ready', () => {
      const guild = client.guilds.cache.get(guildId);

      if (guild) {
        // Fetch the role by name
        const role = guild.roles.cache.find(r => r.name === roleName);

        if (role) {
          const membersWithRole = role.members.map(member => ({
            id: member.user.id,
            username: member.user.username,
            avatarURL: member.user.displayAvatarURL({ dynamic: true }),
            nickname: member.nickname,
          }));

          res.json(membersWithRole);
        } else {
          console.error('Role not found');
          res.status(404).json({ error: 'Role not found' });
        }
      } else {
        console.error('Guild not found');
        res.status(404).json({ error: 'Guild not found' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.findOneUser = (req, res) => {
  const userId = req.params.userId;
  const guildId = req.params.guildId;

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
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

  client.on('ready', () => {
    const guild = client.guilds.cache.get(guildId);
    const guildMember = guild.members.cache.get(userId);

    if (guildMember) {
      const roles = guildMember.roles.cache
        .filter(role => role.name !== '@everyone')
        .reduce((result, role) => {
          result[role.name] = role.id;
          return result;
        }, {});
      const discordUsername = guildMember.user.username;
      const userAvatarUrl = guildMember.user.avatarURL() || 'No avatar available.';
      const serverNickname = guildMember.nickname || 'No server nickname.';
      const joinedTimestamp = guildMember.joinedTimestamp;
      const joinedDate = new Date(joinedTimestamp);
      const formattedDate = joinedDate.toLocaleString();

      res.json({
        USER_SPECIFIC: {
          DISCORD_USERNAME: discordUsername,
          DISCORD_AVATAR: userAvatarUrl,
        },
        GUILD_SPECIFIC: {
          GUILD_ID: guildId,
          GUILD_NAME: guild.name,
          GUILD_JOIN_DATE: formattedDate,
          GUILD_ROLES: roles,
          GUILD_NICKNAME: serverNickname,
        },
        API_SPECIFIC: {
          GUILD_API_URL: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/get`,
          GUILD_USER_API_URL: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/user/${userId}/get`,
        }
      });

    } else {
      res.send('Invalid user or user not found.');
    }

    setTimeout(() => {
      client.destroy();
    }, 10000);
  });

}




/**
 * DISCORD OAUTH2 FLOW
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.auth = async function (req, res) {
  try {
    const {
      code,
      state
    } = req.query;
    const params = new URLSearchParams();
    let user;

    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", `https://api.tonewebdesign.com/pa/discord/auth`);
    params.append("scope", "identify");

    const response = await axios.post("https://discord.com/api/oauth2/token", params);
    const {
      access_token,
      token_type
    } = response.data;

    const userDataResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });

    user = {
      username: userDataResponse.data.username,
      discordId: userDataResponse.data.id,
      userId: state,
      email: userDataResponse.data.email,
      avatar: `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png`,
    };


    const existingUser = await User.findOne({
      where: {
        id: state
      }
    });
    const existingDiscordUser = await DiscordUser.findOne({
      where: {
        discordId: user.discordId
      }
    });

    if (existingDiscordUser) {
      return res.status(400).json({
        error: "Discord ID already in use"
      });
    }

    if (existingUser) {
      existingUser.discordId = userDataResponse.data.id;
      existingUser.avatar_url = `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png`;
      await existingUser.save();
    }

    if (existingDiscordUser) {
      await existingDiscordUser.update(user);
    } else {
      await DiscordUser.create(user);
    }

    const regiment = await Regiment.findOne({
      where: {
        ownerId: user.discordId
      }
    });

    if (regiment && existingUser) {
      existingUser.regimentId = regiment.id;

      let roles = await existingUser.getRoles();
      const hasRole2 = roles.some(role => role.id === 2);

      if (!hasRole2) {
        roles.push(2);
      }

      await existingUser.setRoles(roles);
    }

    const closeScript = `
      <script>
        window.opener.postMessage('popupClosed', '*');
        window.close();
      </script>
    `;

    res.setHeader("Content-Type", "text/html");

    return res.send(`
      <html>
        <body>
          <pre>${JSON.stringify({ user, closeScript }, null, 2)}</pre>
          ${closeScript}
        </body>
      </html>
    `);
  } catch (error) {
    console.log("Error", error);
    return res.send("Some error occurred!");
  }
};




exports.deleteOneUser = async (req, res) => {
  let user;

  try {
    const userId = req.params.userId;

    const discordUser = await DiscordUser.findOne({
      where: {
        userId: userId,
      },
    });

    if (!discordUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await discordUser.destroy();


    const user = await User.findOne({
      where: {
        id: userId
      },
    });

    user.discordId = null;

    await user.save();

    return res.json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}