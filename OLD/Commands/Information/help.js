exports.setup = {
'name' : 'help',
'aliases' : ['h'],
'usage' : 'help <command>',
'details' : 'Shows a help list, or help for a specific command.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true,
'reason' : 'updates'
}
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
let util = [];
let moderation = [];
let cmds = [];
client.commands.map(c => c.setup.name).forEach(c => {
 if(cmds.includes(c)) return;
 else cmds.push(c);
})
cmds = cmds.join(', ')
/*start of command*/

   if(args[0]) {
     if(args[0].search("@everyone") != -1 || args[0].search("@here") != -1) return message.channel.send(`${assistant.emoji.redtick} I can't run this command because a violation was detected`);
     try{client.commands.get(args[0].toLowerCase()).setup;}catch(err){return message.channel.send(`${assistant.emoji.redtick} Could not find command help for \`${args[0]}\``)}
     let helpi = client.commands.get(args[0].toLowerCase()).setup;
     message.channel.send(new Discord.RichEmbed()
                         .setColor('#28e0ca')
                         .setAuthor(`Command: ${args[0].title()}`, client.user.displayAvatarURL)
                         .addField(`Description for Command`, `${helpi.details}`)
                         .addField("Usage", `${helpi.usage}`)
                         .addField("Other Information", `**Permission:** ${helpi.permissionTxt}\n**Command Enabled**: ${helpi.enabled}`)
                         .addField("Aliases", `${helpi.aliases.join(', ')}`)
                         .addField("Examples", (helpi.examples != undefined && helpi.examples.length > 1) ? helpi.examples.join('\n') : "No examples on how to run this CMD"))
      return;
     }

    await message.react(client.emojis.get('390607098658160670'));
    message.channel.send(new Discord.RichEmbed()
                        .setColor('#42f4f1')
                        .setAuthor(client.user.tag, client.user.avatarURL)
                        .addField('Help Menu', `Get help on a command by using \`${message.guild.prefix}help <command>\`\n${assistant.emoji.info} There are ${client.commands.size} commands currently loaded. To see what a command does use \`${message.guild.prefix}help cmd\``)
                        .addField('All commands', cmds)
                        .addField('More information', '~~[Assistant Bot](?q=disabled)~~ | [Assistant Server](https://discord.gg/FKTrmsK)')
                        .addField('Announcement', '**Custom Commands** Released! Go check them out with `help cc`!')
                        .setFooter('Assistant v1.0.1'))
/* end of command */
}