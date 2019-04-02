exports.setup = {
'name' : 'Color',
'aliases' : ['color', 'c'],
'usage' : 'color',
'details' : 'Pick a color at random.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}

exports.permissions = 0;

exports.run = async (client, message, args) => {
  let Discord = require('discord.js')
  let random = '#' + (function co(lor){   return (lor +=
  [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  && (lor.length == 6) ?  lor : co(lor); })('');
  let embed = new Discord.RichEmbed()
  .setTitle(random)
  .addField(`Random Color Generated`)
  .setColor(random);
  message.channel.send(embed);
}
