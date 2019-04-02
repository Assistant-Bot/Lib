exports.setup = {
'name' : 'dm',
'aliases' : 'role @user role1, role2, role3 ++',
'usage' : 'help <command>',
'details' : 'Add/Remove a user from roles. Roles and user can be searched by half spelling them.',
'permission' : 1,
'antiTheft': true
}
exports.permissions = 2;

exports.run = async (client, message, args) => {
let target = args[0];
let text = args.slice(1, args.length).join(' ');
let random = '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
if(target == 'everyone') {
  if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR'))
    return message.channel.send(`You need admin permissions to run this command.`);
  let members = message.guild.members.map(m => m.id);
  let channel = message.channel;
  let Discord = require('discord.js');
  for(let i = 0; i <= message.guild.members.size; i++) {
    try {
    message.guild.members.get(members[i]).send(new Discord.RichEmbed()
    .setColor(random)
    .setAuthor(`Staff Member: ${message.author.tag}`, message.author.avatarURL)
    .addField('Dm information:',`Mass Dm Performed from the server: **${message.guild.name}**`)
    .addField(`Message:`, text)
    .setTimestamp(new Date()));
    } catch (err) {
    continue;
    }
  }
  return message.reply(`Sending message to: **${message.guild.members.size}** members!`);
}

if(target.startsWith('<@')) {
  let member = message.mentions.members.first();
  client.users.get(member.id).send(text);
  message.delete()
  return message.reply('Sent Message');
}

if(client.users.get(target)) {
  message.delete()
  client.users.get(target).send(text)
  return message.reply('Sent Message');
}

if(!target.startsWith('<@')) {
 return message.reply('You need to mention someone or use use `everyone`.');
}
}
