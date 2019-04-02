exports.setup = {
    'name' : 'queue',
    'aliases' : ['q', 'songs'],
    'usage' : 'queue',
    'details' : 'View the queue',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    if(!client.queues.has(message.guild.id)) return message.channel.send(`${assistant.emoji.redtick} Nothing playing.`);
    let guild = client.queues.get(message.guild.id);
    let page = (args[0] == undefined && !parseInt(args[0])) ? 0 : parseInt(args[0]);
    let server = client.queues.get(message.guild.id);
    let songs = [];
    server.queued.forEach(song => {
        songs.push(`[${song.title}](${song.url}) - ${song.time.hours} hrs and ${song.time.minutes} mins`);
    });
    if(server.queued.length / page < 0) return message.channel.send(`${assistant.emoji.redtick} There are only ${server.queued.length / 5} pages.`);
    if(songs.slice(page * 5, page * 5 + 5).length <= 0) return message.channel.send(`${assistant.emoji.redtick} Invalid page.`);
    let pg = songs.slice(page * 5, page * 5 + 5).join('\n');
    let em = new Discord.RichEmbed();
    em.setColor('#40a4e1');
    em.addField(`${message.guild.name}'s queue [${page}]`, pg);
    em.setTimestamp(new Date());
    em.setFooter('Ran');
    em.setAuthor(`Ran by: ${message.author.username}`, message.author.displayAvatarURL)
    return message.channel.send(em)

}