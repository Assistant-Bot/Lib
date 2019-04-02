exports.setup = {
'name' : 'resetnicks',
'aliases' : 'resetnicks, guildset',
'usage' : 'None set',
'details' : 'Reset all nicknames in a server.',
'permission' : 1,
'antiTheft': true
}
exports.permissions = 1;

exports.run = async (client, message, args, assistant) => {
  try {
  let msg = await message.channel.send('Attempting to perform');
    msg.edit(`Changing names for: ${message.guild.members.size} members.`);
  let member = message.guild.members.map(c => c.id);
  for(let i = 0; i < member.length; i++) {
  message.guild.members.get(member[i]).setNickname('', 'reset');
  }
  } catch (err) {
  return assistant.error('Error', `An error occured with detail:\n${err}`, message.channel, 4000)

  }
}
