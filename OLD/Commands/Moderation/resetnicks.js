exports.setup = {
'name' : 'Resetnicks',
'aliases' : ['rn'],
'usage' : 'resetnicks - reset all members nicknames in the server.',
'details' : '<:assistantWarning:390739935562301440> - Rate limited to 5 members every 10 seconds.',
'permission' : 2,
'permissionTxt' : 'Server Administrator',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  const failed = [];
  try {
  if(message.guild.members.size >= 50) return message.channel.send(`${assistant.emoji.redtick} This server is to large for this command`);
  let msg = await message.channel.send('Attempting to perform');
    msg.edit(`Changing names for: ${message.guild.members.size} members.`);
  let member = message.guild.members.map(c => c.id);
  for(let i = 0; i < member.length; i++) {
  try { await message.guild.members.get(member[i]).setNickname('', 'reset');} catch (err) {failed.push((message.guild.members.get(member[i]).user.username) ? message.guild.members.get(member[i]).user.username : 'Not in guild') }
  if(i + 1 == message.guild.members.size) {
   return msg.edit(`${assistant.emoji.check}Reset nick names for: ${message.guild.members.size} members!\nFailed logs: ${failed.join(', ')}`);
  }
  await msg.edit(`Changing names for: ${message.guild.members.size} members. ${i + 1}/${message.guild.members.size}\nFailed logs: ${failed.join(', ')}`);
  }
  } catch (err) {
  return assistant.error('Error', `An error occured with detail:\n${err}`, message.channel, 10000)

  }
}
