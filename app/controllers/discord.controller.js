/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\discord.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Thu February 22nd 2024 7:03:49 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */
const client = require("./clients/discord")

const {
  Client,
  GatewayIntentBits,
  TextChannel,
} = require("discord.js");
const axios = require("axios");
const db = require("../models");
const User = db.User;
const Regiment = db.Regiment;
const DiscordUser = db.DiscordUser;
require("dotenv").config({ path: "/home/paarmy/envs/wor/.env" });


/**
 * Create a webhook for a specific guild and channel
 * This function will create a webhook for a specific guild and channel
 * 
 * @param {*} req - request containing the guildId and channelId
 * @param {*} res - response containing the webhook
 */
exports.createWebhook = async (req, res) => {
  const guildId = req.params.guildId;
  const channelId = req.params.channelId;

  try {
    const guild = await client.guilds.fetch(guildId);
    const webhooks = await guild.fetchWebhooks();

    for (const webhook of webhooks.values()) {
      if (webhook.owner?.id === client.user?.id) {
        await webhook.delete('Removing old webhooks before creating a new one.');
        console.log(`Deleted old webhook: ${webhook.id}`);
      }
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const newWebhook = await channel.createWebhook({
      name: 'Server Info',
      avatar: 'https://app.paarmy.com/assets/boticon.png',
    });

    console.log('New Webhook created:', newWebhook.id);
    const webhookURL = `https://discord.com/api/webhooks/${newWebhook.id}/${newWebhook.token}`;

    await Regiment.update({
      webhook: webhookURL,
      webhook_channel: channel.name
    }, {
      where: {
        guild_id: guildId
      }
    });

    res.json({ webhook: webhookURL });
  } catch (error) {
    console.error('Error creating/deleting webhook:', error);
    res.status(500).json({ error: 'Failed to create/delete webhook.' });
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

  client.on("ready", async () => {
    try {
      const guild = client.guilds.cache.get(id);
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
  const guildId = req.params.guildId;

  try {
    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
      console.error('Guild not found');
      return res.status(404).json({ error: 'Guild not found' });
    }

    let roles;
    try {
      roles = await guild.roles.fetch();
    } catch (fetchError) {
      console.error('Error fetching roles:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }

    const rolesArray = roles.cache.map(role => ({
      id: role.id,
      name: role.name,
      color: role.color,
    }));

    res.json(rolesArray);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.findDiscordUsersByGuildRole = async (req, res) => {
  const guildId = req.params.guildId;
  const roleName = req.query.roleName;

  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      console.error('Guild not found');
      return res.status(404).json({ error: 'Guild not found' });
    }

    await guild.roles.fetch();

    const role = guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      console.error('Role not found');
      return res.status(404).json({ error: 'Role not found' });
    }

    if (!guild.members.cache.size) await guild.members.fetch();

    const membersWithRole = role.members.map(member => ({
      id: member.user.id,
      username: member.user.username,
      avatarURL: member.user.displayAvatarURL({ dynamic: true }),
      nickname: member.nickname,
    }));

    res.json(membersWithRole);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.findOneUser = async (req, res) => {
  const userId = req.params.userId;
  const guildId = req.params.guildId;

  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      console.error('Guild not found');
      return res.status(404).json({ error: 'Guild not found' });
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return res.status(404).json({ error: 'User not found in the guild' });
    }

    const roles = member.roles.cache
      .filter(role => role.name !== '@everyone')
      .reduce((acc, role) => {
        acc[role.name] = role.id;
        return acc;
      }, {});

    const userResponse = {
      USER_SPECIFIC: {
        DISCORD_USERNAME: member.user.username,
        DISCORD_AVATAR: member.user.avatarURL() || 'No avatar available.',
      },
      GUILD_SPECIFIC: {
        GUILD_ID: guildId,
        GUILD_NAME: guild.name,
        GUILD_JOIN_DATE: new Date(member.joinedTimestamp).toLocaleString(),
        GUILD_ROLES: roles,
        GUILD_NICKNAME: member.nickname || 'No server nickname.',
      },
      API_SPECIFIC: {
        GUILD_API_URL: `https://api.wortool.com/wordiscord/guild/${guildId}/get`,
        GUILD_USER_API_URL: `https://api.wortool.com/wordiscord/guild/${guildId}/user/${userId}/get`,
      }
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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