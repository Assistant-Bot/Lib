exports.setup = {
'name' : 'permissions',
'aliases' : ['perms', 'perm'],
'usage' : 'permissions - shows bot permissions\npermissions @user - shows user permissions in the server.',
'details' : 'Show granted and denied permissions for a specific member in the server.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : false,
'reason' : 'being revamped.'
}
exports.permissions = 0;
exports.run = async (client, message, args) => {
try {
let grantedPerms = [];
let deniedPerms = [];
let user;
if(!args[0]) user = message.guild.me;
if(args[0]) user = message.mentions.members.first();
for(let i = 0; i < discordPerms.length; i++) {
  if(!user.hasPermission(`${discordPerms[i]}`)) {
   grantedPerms.push(`❌ ${discordPerms[i]}`)
  } else {
   grantedPerms.push(`✔️ ${discordPerms[i]}`)
  }
}
if(deniedPerms.length == 0) deniedPerms = ['No denied Permissions'];
if(grantedPerms.length == 0) deniedPerms = ['All Permissions denied'];
  console.log(grantedPerms.join('\n'))
let embed = {
 embed: {
  'author' : {
   'name' : client.user.tag,
   'icon_url' : client.user.displayAvatarURL,
   },
   'thumbnail' : {
     'url' : user.user.displayAvatarURL
   },
  'color' : 0x77f442,
  'fields' : [{
   'name' : `Permissions for ${user.user.tag}`,
   'value' : `\`\`\`${grantedPerms.join('\n')}\`\`\``,
   'inline' : true
   },
   {
   'name' : `Command Info`,
   'value' : `This command is currently being tested. Ran by: ${message.author.tag}`,
   'inline' : true
   }],
   'timestamp' : new Date(),
   'footer' : {
     'text' : 'View Permissions for role or user.'
   }
 }
};
  message.channel.send(embed)
} catch (err) {
  message.channel.send(err);
}



}

let discordPerms = ['ADMINISTRATOR', 'MANAGE_GUILD', 'CREATE_INSTANT_INVITE','KICK_MEMBERS','BAN_MEMBERS','MANAGE_CHANNELS','MANAGE_GUILD','ADD_REACTIONS','VIEW_AUDIT_LOG','VIEW_CHANNEL','READ_MESSAGES','SEND_MESSAGES','SEND_TTS_MESSAGES','MANAGE_MESSAGES','EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY','MENTION_EVERYONE','USE_EXTERNAL_EMOJIS','EXTERNAL_EMOJIS','CONNECT','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','USE_VAD','CHANGE_NICKNAME','MANAGE_NICKNAMES','MANAGE_ROLES','MANAGE_ROLES_OR_PERMISSIONS','MANAGE_WEBHOOKS','MANAGE_EMOJIS']
