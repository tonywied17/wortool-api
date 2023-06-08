const { Client, GatewayIntentBits, TextChannel } = require('discord.js');
require('dotenv').config();
// require('dotenv').config({ path: '/home/tonewebdesign/envs/pa/.env' });

exports.findAll = (req, res) => {
  const msg = req.params.msg;

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
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    res.json({ member_count: guild.memberCount, guild: guild });


    client.destroy();
  });
};



exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log('id: ', id);
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
    const guild = client.guilds.cache.get(process.env.DISCORD_GUILD_ID);
    const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    const userId = id;
    console.log('userId: ', userId);
    const guildMember = guild.members.cache.get(userId);

    if (channel instanceof TextChannel) {
      if (guildMember) {
        const roles = guildMember.roles.cache
          .filter(role => role.name !== '@everyone') 
          .map(role => `${role.name} - ${role.id}`);
        const rolesString = roles.join('\n'); 

        const discordUsername = guildMember.user.username;
        const userAvatarUrl = guildMember.user.avatarURL() || 'No avatar available.';
        const serverNickname = guildMember.nickname || 'No server nickname.';

        channel.send(`${discordUsername} / ${serverNickname}\n${userAvatarUrl}\n${rolesString}`);
      }
      res.json({ user: guildMember });
    } else {
      res.send('Invalid channel or channel type is not text');
    }


    setTimeout(() => {
      client.destroy();
    } , 10000);
    // client.destroy(); // Disconnect the client after sending the message
  });
};


exports.destroyBot = (req, res) => {  
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

  client.destroy();

  res.json({ message: 'Bot Destroyed!' });
};