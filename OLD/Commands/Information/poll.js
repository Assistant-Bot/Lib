const lengthyresponse = `poll <channel> | <message> | (like emoji) | (dislike emoji) | [role name]`;
exports.setup = {
'name' : 'poll',
'aliases' : [''],
'usage' : lengthyresponse,
'details' : 'Create a poll in a dedicated channel using custom emojis.',
'permission' : 2,
'permissionTxt' : 'Server Administrator',
'antiTheft': false,
'enabled' : true
}

exports.run = async (client, message, args, assistant) => {
  if(!message.mentions.channels.first()) return assistant.error('Error', `Mention a channel!`, message.channel) 
function addRole(user, role) {
let u = user;
console.log(u);
message.guild.members.get(user.id).addRole(message.guild.roles.find('name', `${role}`).id)
}
function remRole(user, role) {
let u = user;
console.log(`VARIABLE FOR MEMBER:\n${u}`);
message.guild.members.get(user.id).removeRole(message.guild.roles.find('name', `${role}`).id)
}

const cmd = message.content.split(" | ");
const storedAdd = cmd[2];
const storedRemove = cmd[3];
let storedValue = '';
if(cmd[4]) {
  storedValue = cmd[4];
  let role = message.guild.roles.find('name', `${storedValue}`);
  if(role){
    storedValue = '<@&' + role.id + '>\n';
  } else {
    storedValue = ''
  }
} else {
  storedValue =  '';
}
let msgRe = await client.channels.get(`${message.mentions.channels.first().id}`).send(`${storedValue}${cmd[1]}`);
 if(cmd[3].search('<') != -1 && cmd[1].search('<') != -1){
   await msgRe.react(`${cmd[2]}`);
   await msgRe.react(`${cmd[3]}`);
 } else if(cmd[2].search('<') == -1) {
    msgRe.react(`${cmd[2]}`);
   if(cmd[3].search('<') == -1) {
    msgRe.react(`${cmd[3]}`);
   }
   return;
 } else if(cmd[3].search('<') == -1) {
    msgRe.react(`${cmd[3]}`);
} else {
   msgRe.react(client.emojis.get(`${cmd[3].split(':')[2].split('>')[0]}`));
   msgRe.react(client.emojis.get(`${cmd[2].split(':')[2].split('>')[0]}`));
}
console.log(cmd[3].split(":"))
/*const filter = (reaction, user) => reaction.emoji.id == '346685847552393226';
const collector = msgRe.createReactionCollector(filter, { time: cmd[2] * 60000});
collector.on('collect', r => addRole(r.member, storedAdd));

const filter2 = (reaction, user) => reaction.emoji.id == '346685858318909440' && user;
const collector2 = msgRe.createReactionCollector(filter2, { time: cmd[2] * 60000});
collector2.on('collect', r => console.log(`This is the REDTICK:\n ${r}`) && remRole(r.user, storedAdd));*/
}
