/*
 * File: c:\Users\tonyw\Desktop\PA API\express-paarmy-api\app\controllers\discord.controller.js
 * Project: c:\Users\tonyw\Desktop\WoRTool API\wortool-api
 * Created Date: Tuesday June 27th 2023
 * Author: Tony Wiedman
 * -----
 * Last Modified: Fri February 23rd 2024 7:14:51 
 * Modified By: Tony Wiedman
 * -----
 * Copyright (c) 2023 Tone Web Design, Molex
 */
const client = require("./clients/discord");
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
        await webhook.delete(
          "Removing old webhooks before creating a new one."
        );
        console.log(`Deleted old webhook: ${webhook.id}`);
      }
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      throw new Error("Channel not found");
    }

    const newWebhook = await channel.createWebhook({
      name: "Server Info",
      avatar: "https://app.paarmy.com/assets/boticon.png",
    });

    console.log("New Webhook created:", newWebhook.id);
    const webhookURL = `https://discord.com/api/webhooks/${newWebhook.id}/${newWebhook.token}`;

    await Regiment.update(
      {
        webhook: webhookURL,
        webhook_channel: channel.name,
      },
      {
        where: {
          guild_id: guildId,
        },
      }
    );

    res.json({ webhook: webhookURL });
  } catch (error) {
    console.error("Error creating/deleting webhook:", error);
    res.status(500).json({ error: "Failed to create/delete webhook." });
  }
};

/**
 * Find a single guild
 * This function will find a single guild based on the request id
 *
 * @param {*} req - request containing the guildId
 * @param {*} res - response containing the guild record
 */
exports.findOneGuild = async (req, res) => {
  const id = req.params.id;

  try {
    const guild = await client.guilds.fetch(id);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const guildData = {
      guild: guild,
    };

    res.json({ guild: guildData });
  } catch (error) {
    console.error("Error fetching guild:", error);
    res.status(500).json({ error: "Failed to fetch guild." });
  }
};

/**
 * Find all guild channels
 * This function will find all guild channels based on the request id
 *
 * @param {*} req - request containing the guildId
 * @param {*} res - response containing the guild channels
 */
exports.findGuildChannels = async (req, res) => {
  const id = req.params.id;

  try {
    const guild = await client.guilds.fetch(id);
    const textChannels = guild.channels.cache.filter(
      (channel) => channel.type === 0
    );

    const channelData = textChannels
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    res.json({
      channels: channelData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch guild text channels.",
    });
  }
};

/**
 * Get all DiscordGuild Roles
 * This function will get all DiscordGuild roles from discord api
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findDiscordGuildRoles = async (req, res) => {
  const guildId = req.params.guildId;

  try {
    const guild = await client.guilds.fetch(guildId);

    if (!guild) {
      console.error("Guild not found");
      return res.status(404).json({ error: "Guild not found" });
    }

    let roles;
    try {
      roles = await guild.roles.fetch();
    } catch (fetchError) {
      console.error("Error fetching roles:", fetchError);
      return res.status(500).json({ error: "Failed to fetch roles" });
    }

    const rolesArray = roles.cache.map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
    }));

    res.json(rolesArray);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Find all DiscordGuild Members by Role
 * This function will find all DiscordGuild Members in a specific guild by role
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findDiscordUsersByGuildRole = async (req, res) => {
  const guildId = req.params.guildId;
  const roleName = req.query.roleName;

  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      console.error("Guild not found");
      return res.status(404).json({ error: "Guild not found" });
    }

    await guild.roles.fetch();

    const role = guild.roles.cache.find((r) => r.name === roleName);
    if (!role) {
      console.error("Role not found");
      return res.status(404).json({ error: "Role not found" });
    }

    if (!guild.members.cache.size) await guild.members.fetch();

    const membersWithRole = role.members.map((member) => ({
      id: member.user.id,
      username: member.user.username,
      avatarURL: member.user.displayAvatarURL({ dynamic: true }),
      nickname: member.nickname,
    }));

    res.json(membersWithRole);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Find all DiscordGuild Members
 * This function will find all DiscordGuild Members in a specific guild and return discord api data
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findOneUser = async (req, res) => {
  const userId = req.params.userId;
  const guildId = req.params.guildId;

  try {
    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      console.error("Guild not found");
      return res.status(404).json({ error: "Guild not found" });
    }

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) {
      return res.status(404).json({ error: "User not found in the guild" });
    }

    const roles = member.roles.cache
      .filter((role) => role.name !== "@everyone")
      .reduce((acc, role) => {
        acc[role.name] = role.id;
        return acc;
      }, {});

    const userResponse = {
      USER_SPECIFIC: {
        DISCORD_USERNAME: member.user.username,
        DISCORD_AVATAR: member.user.avatarURL() || "No avatar available.",
      },
      GUILD_SPECIFIC: {
        GUILD_ID: guildId,
        GUILD_NAME: guild.name,
        GUILD_JOIN_DATE: new Date(member.joinedTimestamp).toLocaleString(),
        GUILD_ROLES: roles,
        GUILD_NICKNAME: member.nickname || "No server nickname.",
      },
      API_SPECIFIC: {
        GUILD_API_URL: `https://api.wortool.com/wordiscord/guild/${guildId}/get`,
        GUILD_USER_API_URL: `https://api.wortool.com/wordiscord/guild/${guildId}/user/${userId}/get`,
      },
    };

    res.json(userResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Send a message to a specific guild and channel
 * This function will send a message to a specific guild and channel
 * (This was replaced by webhook server announcements)
 * @param {*} req
 * @param {*} res
 */
exports.sendOneMsg = async (req, res) => {
  const { msg, guildId, channelId } = req.params;

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.cache.get(channelId);

    if (channel.type === 0) {
      await channel.send(msg);
      res.json({
        message: "Message sent!",
        msg: msg,
        guildId: guildId,
        channelId: channelId,
      });
    } else {
      res.status(400).json({ error: "Channel is not a text channel." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
};

/**
 * Find one DiscordUser
 * This function will find a single DiscordUser based on the userId
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
        message: "User not found",
      });
    }

    return res.json(discordUser);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Find all DiscordUsers
 * This function will find all DiscordUsers
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
  try {
    const discordUsers = await DiscordUser.findAll();

    return res.json(discordUsers);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/**
 * Delete a DiscordUser
 * This function will delete a DiscordUser from the database
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteOneUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const discordUser = await DiscordUser.findOne({
      where: {
        userId: userId,
      },
    });
    if (!discordUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    await discordUser.destroy();
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    user.discordId = null;
    await user.save();
    return res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
