exports.setup = {
    'name': 'roleperms',
    'aliases' : ['rp'],
    'aliases': 'roleperms <name> [permissions]',
    'details': 'Edit role permissions for **Every Channel** in the guild.\nAvailible Arguments: -c (current permissions for that role), -r (remove all permissions for role), [Permissions] (use perm list command for a list of permissions)',
    'permission': 4,
    'usage' : 'none set',
    'antiTheft': true
}
exports.permissions = 2;
exports.run = async (client, message, args, assistant) => {
let argsQ = message.content.split('"')
let role = argsQ[1]
let perms = args[2]
let ag = ['-c', '-r']
let permissions = ['noView', 'message', 'talk', 'messageDelete', 'userNick', 'manageRoles', 'admin', 'manageServer', 'auditlog']
let c = message.channel;
if(!message.guild.roles.find('name', argsQ[1])) {
  return assistant.error('Error', `Could Not find role: \`${argsQ[1]}\` in this server.`, c);
}
if(!message.guild.members.get(client.user.id).permissions.has('MANAGE_CHANNELS'))
  return assistant.error('Error', 'I need `MANAGE_CHANNELS` permission!', c);
role = message.guild.roles.find('name', argsQ[1]).id;
console.log(role)

if(!ag.includes(perms)) {
  perms = argsQ.slice(2).join('').trim().split(',').join('').split(' ');
  console.log(editArr(perms))
  let newP = editArr(perms);
  message.channel.send(`<:check:346685847552393226> ${changePerms(newP)}`)
}
  function editArr(perms) {
    let split = perms;
    let temp = [];
    for(let i = 0; i > split.length; i++) {
    if(!permissions.includes(split[i])) {
      if(!discordPerms.toLowerCase().includes(split[i].toLowerCase())) {
      split.splice(i, 1)
      }
    }
      if(split[i] == 'noView') {
      split[i] = 'VIEW_CHANNEL'
      } else if (split[i] == 'read') {
      split[i] = 'READ_MESSAGE_HISTORY'
      } else if (split[i] == 'message') {
      split[i] = 'SEND_MESSAGES'
      } else if (split[i] == 'talk') {
      split[i] = 'SPEAK'
      } else if (split[i] == 'messageDelete') {
      split[i] = 'MANAGE_MESSAGES'
      } else if (split[i] == 'userNick') {
      split[i] = 'CHANGE_NICKNAME'
      } else if (split[i] == 'manageRoles') {
      split[i] = 'MANAGE_ROLES'
      } else if (split[i] == 'admin') {
      split[i] = 'ADMINISTRATOR'
      } else if (split[i] == 'manageServer') {
      split[i] = 'MANAGE_GUILD'
      } else {
      split[i] = 'VIEW_AUDIT_LOG'
      }
      temp.push(split[i])
    }
    return temp;
  }

function changePerms(obj) {
  let channel = message.guild.channels.map(c => c.id);

  for(let i=0; i < message.guild.channels.size; i++){
    for(let n=0; n < obj.length; n++) {
    let eN = obj[n]
    message.guild.channels.get(channel[i]).overwritePermissions(role, {
    eN: true
    })
   }
  }
  return `Changed permission for: **${message.guild.channels.size}** channels`
}

}

let discordPerms = ['ADMINISTRATOR','CREATE_INSTANT_INVITE','KICK_MEMBERS','BAN_MEMBERS','MANAGE_CHANNELS','MANAGE_GUILD','ADD_REACTIONS','VIEW_AUDIT_LOG','VIEW_CHANNEL','READ_MESSAGES','SEND_MESSAGES','SEND_TTS_MESSAGES','MANAGE_MESSAGES','EMBED_LINKS','ATTACH_FILES','READ_MESSAGE_HISTORY','MENTION_EVERYONE','USE_EXTERNAL_EMOJIS','EXTERNAL_EMOJIS','CONNECT','SPEAK','MUTE_MEMBERS','DEAFEN_MEMBERS','MOVE_MEMBERS','USE_VAD','CHANGE_NICKNAME','MANAGE_NICKNAMES','MANAGE_ROLES','MANAGE_ROLES_OR_PERMISSIONS','MANAGE_WEBHOOKS','MANAGE_EMOJIS']
