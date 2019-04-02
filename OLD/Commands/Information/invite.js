exports.setup = {
'name' : 'invite',
'aliases' : ['inv'],
'usage' : 'invite',
'details' : 'Invite link for assistant',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true,
'reason' : 'updates'
}
exports.run = async function(client, message) {
const Discord = require('discord.js')
message.channel.send(new Discord.RichEmbed()
                   .setColor('#42f4e8')
                   .addField('Invites', `[All permissions](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot) | [Normal](https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=53509363&scope=bot) | [Disabled]()`))
}
