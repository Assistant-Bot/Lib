exports.setup = {
'name' : 'globaladmins',
'aliases' : ['gas', 'gba'],
'usage' : `!<botadmin`,
'details' : 'Show all bot admins, and show if they are online!',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
let admins = [];
let server = client.guilds.get('466732144429891584');
let globalAdmins = server.roles.get('466748331511513115').members.map(m => m.id);
  for(let i = 0; i < globalAdmins.length; i++) {
    let temp = client.users.get(globalAdmins[i]);
    let presence = temp.presence.status;
    let status = "";
   if (presence =="online") {
         status = "<:onlinesml:455927483167014943> Online"
    } else if (presence =="idle") {
         status = "<:idlesml:455927482898710561> Away"
    } else if (presence =="dnd") {
         status = "<:dndsml:455927482323828768> Do not disturb"
    } else if (presence =="offline") {
         status = "<:offlinesml:455927483217346560> Offline"
    } else {
         status = ""
    }
    admins.push(`${status} - **${temp.tag}**`)
  
  }
const Discord = require('discord.js');
let embed = new Discord.RichEmbed()
.setColor('#36393f')
.setAuthor(client.user.tag, client.user.avatarURL)
.setTimestamp(new Date())
.addField('Assistant Global Administrators', `**__<:assistantSupport:390611324612247562> Message Admins by joining the support server in the help menu.__**\n${admins.join('\n')}`)
.setFooter('Assistant Global Admins');
  message.channel.send(embed)
}