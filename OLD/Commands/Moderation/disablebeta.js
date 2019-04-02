exports.setup = {
    'name' : 'disbeta',
    'aliases' : ['disb', 'disableb'],
    'usage' : 'Nothing shown here.',
    'details' : 'Nothing shown here.',
    'permission' : 6,
    'permissionTxt' : 'Developer',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'disabled'
    }
    const banned = [];
    exports.run = async (client, message, args, assistant) => {
      if(!args[0]) return message.channel.send(`${assistant.emoji.redtick} Provide a server id.`);
      if(!parseInt(args[0])) return message.channel.send(`${assistant.emoji.redtick} Provide a server id.`);
      if(!client.guilds.get(args[0])) return message.channel.send(`${assistant.emoji.redtick} Given server invalid or not found.`);
      let server = client.guilds.get(args[0]);
      let m = await message.channel.send(`${assistant.emoji.square} Removing server **${server.name}** from beta guild whitelist.`);
      try {
        await client.betaGuild(args[0], 'no');
        return m.edit(`${assistant.emoji.check} **${server.name}** Remove from beta guild whitelist.`);
      } catch (e) {
        return m.edit(`${assistant.emoji.redtick} **${server.name}** Failed to remove guild to beta whitelist.`);
      }
    }