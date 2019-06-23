module.exports = async (bot, msg, args, Util, emojis, command, c) => {
    let embed = new Util.SimpleEmbed();
    embed.setAuthor(msg.guild.name + ' | ' + msg.guild.id, msg.guild.iconURL);
    embed.setTitle('Error occured with command: ' + command.name);
    embed.addField('Author', `${msg.author.tag} (\`${msg.author.id}\`)`, true);
    embed.addField('Arguments', args.join(' '), true);
    embed.addField('Full Request', '```' + Util.fieldContent(msg.content) + '```', true);
    if (c) embed.addField('Error Details', '```js\n' + c + '\n```', true);
    embed.setColor('#ff0000');
    embed.setFooter('Assistant v1', bot.user.avatarURL);
    embed.setTimestamp(new Date());

    return bot.createMessage('591876465285529600', embed);
}