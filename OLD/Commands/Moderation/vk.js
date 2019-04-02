exports.setup = {
'name' : 'voicekick',
'aliases' : ['vk'],
'usage' : 'vk @Olybear9 being unbearable - Kicks @User for "being unbearable"\nvk @user <reason>',
'details' : '',
'permission' : 2,
'permissionTxt' : 'Server Administrator',
'antiTheft': false,
'enabled' : true
}
exports.run = async function(client, message, args) {
let server = require('../../lib/Shortner.js')
if(!message.mentions.members.first()) return message.channel.send('No user found.');
let user = message.mentions.members.first();
let reason = args.slice(1, args.length).join(' ');
if(!args[1]) reason = 'No reason provided.';
let clientPerms = message.guild.member(client.user).roles.posistion;
let c = message.channel;
if(!user.voiceChannel) return server.send(message.channel, 'I can\'t kick a user that isn\'t in a voice channel.');
if(!server.MemberPermissions(client.user, message.guild, 'MANAGE_CHANNELS', client)) return server.send(c, "I need `MANAGE_CHANNELS` permissions");
if(!server.MemberPermissions(client.user, message.guild, 'MOVE_MEMBERS', client)) return server.send(c, 'I need `MOVE_MEMBERS` permissions');
  let temp = user.voiceChannel.name;
  await message.guild.createChannel('AssistantKickChannelTemporary', 'voice', [], `Voice Kick Performed by: ${message.author.tag} - ${reason}`)
    .then(channel => message.guild.members.get(user.id).setVoiceChannel(channel.id));
  await setTimeout(() => {client.channels.get(message.guild.channels.find('name', 'AssistantKickChannelTemporary').id).delete(`Voice Kick Performed by: ${message.author.tag} - ${reason}`)}, 200);
message.channel.send(`Kicked ${user.user.tag} from the voice channel: **${temp}**. Reason: \`${reason}\``);
}
