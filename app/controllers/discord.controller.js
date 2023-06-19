const {
  Client,
  GatewayIntentBits,
  TextChannel,
} = require("discord.js");
const axios = require("axios");
const db = require("../models");
const User = db.user;
const DiscordUser = db.discordUser;
const DiscordGuild = db.discordGuild;
require("dotenv").config({ path: "/home/tonewebdesign/envs/pa/.env" });

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

  client.on("ready", () => {
    const guild = client.guilds.cache.get(id);

    res.json({ guild: guild });

    client.destroy();
  });
};

exports.findOne = async (req, res) => {
  try {
    const userId = req.params.userId;

    const discordUser = await DiscordUser.findOne({
      where: {
        userId: userId,
      },
    });

    if (!discordUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(discordUser);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findAll = async (req, res) => {
  try {
    const discordUsers = await DiscordUser.findAll();

    return res.json(discordUsers);
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
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

/**
 * DISCORD OAUTH2 FLOW
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.auth = async function (req, res) {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const params = new URLSearchParams();
    let user;

    params.append("client_id", process.env.CLIENT_ID);
    params.append("client_secret", process.env.CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append(
      "redirect_uri",
      `https://api.tonewebdesign.com/pa/discord/auth`
    );
    params.append("scope", "identify");

    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      params
    );
    const { access_token, token_type } = response.data;

    const userDataResponse = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          authorization: `${token_type} ${access_token}`,
        },
      }
    );

    user = {
      username: userDataResponse.data.username,
      discordId: userDataResponse.data.id,
      userId: state,
      email: userDataResponse.data.email,
      avatar: `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png`,
    };

    const existingUser = await User.findOne({
      where: {
        id: state,
      },
    });

    const existingDiscordUser = await DiscordUser.findOne({
      where: {
        discordId: user.discordId,
      },
    });

    if (existingDiscordUser) {
      return res.status(400).json({ error: "Discord ID already in use" });
    }

    if (existingUser) {
      existingUser.discordId = userDataResponse.data.id;
      await existingUser.save();
    }

    if (existingDiscordUser) {
      await existingDiscordUser.update(user);
    } else {
      await DiscordUser.create(user);
    }

    // const guildsResponse = await axios.get(
    //   "https://discord.com/api/users/@me/guilds",
    //   {
    //     headers: {
    //       authorization: `${token_type} ${access_token}`,
    //     },
    //   }
    // );

    // const guilds = guildsResponse.data.map((guild) => ({
    //   name: guild.name,
    //   guildId: guild.id,
    //   discordId: userDataResponse.data.id,
    //   userId: state,
    //   icon: guild.icon
    //     ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    //     : null,
    // }));

    // for (const guildData of guilds) {
    //   const existingGuild = await DiscordGuild.findOne({
    //     where: {
    //       guildId: guildData.guildId,
    //     },
    //   });

    //   if (existingGuild) {
    //     await existingGuild.update(guildData);
    //   } else {
    //     await DiscordGuild.create(guildData);
    //   }
    // }

    // const result = {
    //   user,
    //   guilds,
    // };

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
