exports.setup = {
'name' : 'uptime',
'aliases' : [''],
'usage' : 'uptime - Show uptime for Assistant',
'details' : 'Show uptime for Assistant.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}


exports.run = function(client, message, args) {
/* Readable Uptime format */
   let temp = process.uptime();
    var days = Math.floor((temp %= 31536000) / 86400);
    var hours = Math.floor((temp %= 86400) / 3600);
    var minutes = Math.floor((temp %= 3600) / 60);
    var seconds = temp % 60;
/* end of uptime stuff */
const Discord = require('discord.js')
message.channel.send(new Discord.RichEmbed()
                    .setColor('#28e0ca')
                    .addField("Uptime", `Current uptime: ${days} days, ${hours} hours, ${minutes} minutes, and ${Math.round(seconds)} seconds.`)
                    )
}
