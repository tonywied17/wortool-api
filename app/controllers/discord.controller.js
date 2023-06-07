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
  client.login('MTExNjExNDQzMjUwMjgwODYxNw.G0Xwz1.8jFxFES7B84g1bg_5fqhC9c5uGTNEbPSd09T_o');


  client.once('ready', () => {
    const guild = client.guilds.cache.get('850786736756883496');
    const channel = guild.channels.cache.get('901993697888051200');

    

    if (channel instanceof TextChannel) {
      // channel.send(`${msg} ${channel}`); // Send a message to the channel
      res.json({ member_count: guild.memberCount, guild: guild});
    } else {
      res.send('Invalid channel or channel type is not text');
    }

    client.destroy(); // Disconnect the client after sending the message
  });

  
};
