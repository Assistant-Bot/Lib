exports.setup = {
'name' : 'fix',
'usage' : 'help <command>',
'info' : 'Fix random duplicated channels called AssistantKickChannelTemporary',
'permission' : 'Everyone',
'permInt': 0
}
exports.run = async(client, message, args) => {
  let length = 0;
  let channels = message.guild.channels.map(c => c.id);
  for(let i = 0; i < channels.length; i++) {
    if(client.channels.get(channels[i]).name == 'AssistantKickChannelTemporary') {
    client.channels.get(channels[i]).delete()
    length++;
    }
  }
  message.channel.send(`Fixed: **${length}** channels.`);
}
