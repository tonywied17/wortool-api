const { Client, GatewayIntentBits, TextChannel, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const db = require('../models');
const DiscordUser = db.discordUser;
const DiscordGuild = db.discordGuild;
const Op = db.Sequelize.Op;
require('dotenv').config();
// require('dotenv').config({ path: '/home/tonewebdesign/envs/pa/.env' });


exports.findAll = (req, res) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ],
  });
  try {
    client.login(process.env.DISCORD_TOKEN);

    client.on('ready', () => {

      res.json({ online: true });

      client.destroy();
    })
  } catch (err) {
    res.json({ online: false, err: err });
  }
};


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

    res.json({ guild: guild });

    client.destroy();
  });
}

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
        .map(role => ({ name: role.name, id: role.id }));

      const discordUsername = guildMember.user.username;
      const userAvatarUrl = guildMember.user.avatarURL() || 'No avatar available.';
      const serverNickname = JSON.stringify(guildMember.nickname) || 'No server nickname.';
      const serverNicknameCleaned = serverNickname.replace(/["\\]/g, '').replace("'", "");
      const joinedTimestamp = guildMember.joinedTimestamp;
      const joinedDate = new Date(joinedTimestamp);
      const formattedDate = joinedDate.toLocaleString();

      res.json({
        USER_SPECIFIC: {
          DISCORD_USERNAME: discordUsername,
          DISCORD_ID: guildMember.id,
          DISCORD_AVATAR: userAvatarUrl,
        },
        GUILD_SPECIFIC: {
          GUILD_NICKNAME: serverNicknameCleaned,
          GUILD_NAME: guild.name,
          GUILD_ID: guildId,
          GUILD_JOIN_DATE: formattedDate,
          GUILD_ROLES: roles,
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


exports.findOneUserMsg = (req, res) => {
  const userId = req.params.userId;
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

  client.on('ready', () => {
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);
    const guildMember = guild.members.cache.get(userId);

    // const user = guildMember.user;

    if (channel instanceof TextChannel) {
      if (guildMember) {
        const rolesArr = guildMember.roles.cache
          .filter(role => role.name !== '@everyone')
          .map(role => ({ name: role.name, id: role.id }));

        const maxRolesToPrint = 49;
        const roles = guildMember.roles.cache
          .filter(role => role.name !== '@everyone')
          .map(role => role.name)
          .slice(0, maxRolesToPrint);

        const rolesString = roles.join('\n');

        const discordUsername = guildMember.user.username;
        const userAvatarUrl = guildMember.user.avatarURL() || 'No avatar available.';
        const serverNickname = guildMember.nickname || 'No server nickname.';
        const serverNicknameCleaned = serverNickname.replace(/["\\]/g, '').replace("'", '');


        const joinedTimestamp = guildMember.joinedTimestamp;
        const joinedDate = new Date(joinedTimestamp);
        const formattedDate = joinedDate.toLocaleString();

        if (channel instanceof TextChannel) {
          const daddyEmbed = new EmbedBuilder()
            .setColor('#7e0807')
            .setTitle('User Information')
            .setURL(`https://api.tonewebdesign.com/pa/discord/guild/${guildId}/user/${userId}/get`)
            .setThumbnail(userAvatarUrl)
            .addFields(
              { name: 'Discord Username', value: discordUsername },
              { name: 'Server Nickname', value: serverNicknameCleaned },
              { name: 'Guild ID', value: `\`${guildId}\``, inline: true },
              { name: 'Guild Name', value: guild.name, inline: true },
              { name: 'Joined Server', value: formattedDate },
              { name: 'Guild Roles', value: rolesString },
              { name: 'Guild API', value: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/get` },
              { name: 'Guild User API', value: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/user/${userId}/get` },
            )
            .setImage(userAvatarUrl)
            .setTimestamp()

          channel.send({ embeds: [daddyEmbed] });
        }
        res.json({
          USER_SPECIFIC: {
            DISCORD_USERNAME: discordUsername,
            DISCORD_ID: guildMember.id,
            DISCORD_AVATAR: userAvatarUrl,
          },
          GUILD_SPECIFIC: {
            GUILD_NICKNAME: serverNicknameCleaned,
            GUILD_NAME: guild.name,
            GUILD_ID: guildId,
            GUILD_JOIN_DATE: formattedDate,
            GUILD_ROLES: rolesArr,
          },
          API_SPECIFIC: {
            GUILD_API_URL: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/get`,
            GUILD_USER_API_URL: `https://api.tonewebdesign.com/pa/discord/guild/${guildId}/user/${userId}/get`,
          }
        });

        // channel.send(`${discordUsername} / ${serverNickname}\n${userAvatarUrl}\n${rolesString}`);
      }
      res.json({ user: guildMember });
    } else {
      res.send('Invalid channel or channel type is not text');
    }
    setTimeout(() => {
      client.destroy();
    }, 10000);
  });
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

  client.on('ready', () => {
    const guild = client.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);

    if (channel instanceof TextChannel) {
      channel.send(msg);
    }
    res.json({ message: 'Message sent!', msg: msg, guildId: guildId, channelId: channelId });

    setTimeout(() => {
      client.destroy();
    }, 10000);
  });
}


exports.destroyBot = (req, res) => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
    ],
  });

  client.login(process.env.DISCORD_TOKEN);

  client.destroy();

  res.json({ message: 'Bot Destroyed!' });

};



//auth shit

exports.auth = async function (req, res) {
  try {
    const code = req.query.code;
    const params = new URLSearchParams();
    let user;

    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:8083/pa/discord/auth");

    const response = await axios.post('https://discord.com/api/oauth2/token', params);
    const { access_token, token_type } = response.data;

    const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token_type} ${access_token}`
      }
    });

    console.log('Data: ', userDataResponse.data);

    user = {
      username: userDataResponse.data.username,
      email: userDataResponse.data.email,
      avatar: `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png`,
      id: userDataResponse.data.id,
    };


    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        authorization: `${token_type} ${access_token}`
      }
    });


    const guilds = guildsResponse.data;

    return res.send(`
  <div style="margin: 25px auto;
    max-width: 666px;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: sans-serif;">
    <h3>Welcome ${user.username}</h3>
    <div style="display: flex; align-items: center;">
      <img src="${user.avatar}" style="width: 80px; height: 80px; border-radius: 50%; margin-right: 10px;">

      <div style="display: flex; flex-direction: column;">
        <span>Email: ${user.email}</span>
        <span>User ID: ${user.id}</span>
      </div>
    </div>

    <h4>Guilds:</h4>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 10px; margin-top: 20px;">
      ${guilds
        .map(
          (guild) => `
            <div style="text-align: center;">
              <p><b><big>${guild.name}</big></b><br /> (ID: ${guild.id})</p>
              ${guild.icon
              ? `<img src="https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png" style="max-width: 100px; max-height: 100px;"/>`
              : '❌ NO ICON'
            }
            </div>
          `
        )
        .join('')}
    </div>
  </div>
`);

  } catch (error) {
    console.log('Error', error);
    return res.send('Some error occurred!');
  }
};





exports.authJSON = async function (req, res) {
  try {
    const code = req.query.code;
    const params = new URLSearchParams();

    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', "http://localhost:8083/pa/discord/authJSON");

    const response = await axios.post('https://discord.com/api/oauth2/token', params);
    const { access_token, token_type } = response.data;

    const userDataResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token_type} ${access_token}`
      }
    });

    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
      headers: {
        authorization: `${token_type} ${access_token}`
      }
    });

    const user = {
      username: userDataResponse.data.username,
      email: userDataResponse.data.email,
      avatar: `https://cdn.discordapp.com/avatars/${userDataResponse.data.id}/${userDataResponse.data.avatar}.png`,
      userId: userDataResponse.data.id,
    };

    // Check if the user already exists in the database
    const existingUser = await DiscordUser.findOne({
      where: {
        userId: user.userId
      }
    });

    // Update the user if it exists, otherwise create a new user
    if (existingUser) {
      await existingUser.update(user);
    } else {
      await DiscordUser.create(user);
    }

    const guilds = guildsResponse.data.map((guild) => ({
      name: guild.name,
      guildId: guild.id,
      userId: user.userId,
      icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null
    }));
    
    for (const guildData of guilds) {
      const existingGuild = await DiscordGuild.findOne({
        where: {
          guildId: guildData.guildId
        }
      });
    
      if (existingGuild) {
        await existingGuild.update(guildData);
      } else {
        await DiscordGuild.create(guildData);
      }
    }

    const result = {
      user,
      guilds
    };

    return res.json(result);
  } catch (error) {
    console.log('Error', error);
    return res.send('Some error occurred!');
  }
};
