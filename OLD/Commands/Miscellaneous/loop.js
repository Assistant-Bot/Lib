exports.setup = {
    'name' : 'loop',
    'aliases' : ['lp'],
    'usage' : 'loop',
    'details' : 'Loops the queue',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    if(!client.queues.has(message.guild.id)) return message.channel.send(`${assistant.emoji.redtick} Nothing playing.`);
    let guild = client.queues.get(message.guild.id);
    if(guild.settings.loop == false) client.queues.get(message.guild.id).settings.loop = true;
    else client.queues.get(message.guild.id).settings.loop = false;
    let em = new Discord.RichEmbed();
    em.setColor('#40a4e1');
    em.setAuthor(`Queue Loop: ${(guild.settings.loop == true) ? "enabled." : "disabled."}`, 'https://cdn.discordapp.com/attachments/424722925074120705/517972142671921153/musicLoop.png');
    em.setTimestamp(new Date());
    em.addField(`Queue loop settings:`, `${(guild.settings.loop == true) ? assistant.emoji.check : assistant.emoji.redtick} **${message.author.username}** ${(guild.settings.loop == true) ? "enabled" : "disabled"} music loop for: **${guild.queued.length + guild.played.length}** songs!`);
    message.channel.send(em);
}