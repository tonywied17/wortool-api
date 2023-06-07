const { Client, GatewayIntentBits, TextChannel } = require('discord.js');

exports.findAll = (req, res) => {
  const msg = req.params.msg;

  // if (!msg) {
  //   res.json({ message: "No Message Provided!"});
  //   return; 
  // }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      // Add more intents as needed
    ],
  });
  client.login('_BOT_TOKEN_');


  client.once('ready', () => {
    const guild = client.guilds.cache.get('');
    const channel = guild.channels.cache.get('');

    

    if (channel instanceof TextChannel) {
      // channel.send(`${msg} ${channel}`); // Send a message to the channel
      res.json({ member_count: guild.memberCount, guild: guild});
    } else {
      res.send('Invalid channel or channel type is not text');
    }

    client.destroy(); // Disconnect the client after sending the message
  });

  
};
