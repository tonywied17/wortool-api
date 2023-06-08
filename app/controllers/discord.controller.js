const { Client, GatewayIntentBits, TextChannel, EmbedBuilder } = require('discord.js');
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