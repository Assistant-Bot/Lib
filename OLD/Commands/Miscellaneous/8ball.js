exports.setup = {
    'name' : '8ball',
    'aliases' : ['8b'],
    'usage' : '8ball will Olybear9 be popular?',
    'details' : 'Ask the 8ball a question',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    if(!message.guild.members.get(client.user.id).hasPermission("EMBED_LINKS")) return message.channel.send(`${assistant.emoji.redtick} I need permissions to embed links!`);
    if(!args[0]) return message.channel.send('You need something to 8ball');
    let choices = ["It is certain", "It is decidedly so", "Without a doubt", "Yes - definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Reply hazy, try again", "Signs point to yes", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];
    let em = new Discord.RichEmbed();
    let response = choices[Math.floor(choices.length * Math.random())];
    em.setColor(message.member.displayHexColor);
    em.addField('🎱 8ball!', response)
    return message.channel.send(em);
}