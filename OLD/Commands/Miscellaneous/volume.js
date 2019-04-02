exports.setup = {
    'name' : 'volume',
    'aliases' : ['v'],
    'usage' : 'volume <level>',
    'details' : 'Play music',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Util = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    let serverQueue = client.queues.get(message.guild.id);
    if(!serverQueue) return message.channel.send('Nothing Playing');
    if(!args[0]) return message.channel.send(`Current volume: **${serverQueue.volume}**`);
    if(args[0] > 10) return message.channel.send(`You can't set the volume higher than 10.`);
    serverQueue.settings.volume = parseInt(args[0]);
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5)
    message.channel.send(`Volume changed to: **${args[0]}**`)
    return;
}