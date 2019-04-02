exports.setup = {
'name' : 'stats',
'aliases' : [''],
'usage' : '`stats <command>` - get usage on a command\nExamples:\n -`stats all` - Shows stats for all commands.\n -`stats help` - Shows stats for help.',
'details' : 'See how many times a command has been used.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
 if(args[0].toLowerCase() == 'all') {
   let cmdlist = [];
   for(let i = 0; i < Object.keys(client.uses).length; i++) {
    let index = Object.keys(client.uses)[i]
    cmdlist.push(`**${i + 1}**: Command: ${index}\n -Uses: ${client.uses[index].amount}\n -Percentage: ${calculate(client.uses[index].amount)}%`)
   }
   let embed = new Discord.RichEmbed()
    .setColor('#42f4f4')
    .setAuthor(client.user.tag, client.user.avatarURL)
    .addField('All command usages', `Shows a list of usage for each command.`)
    .addField('Commands', cmdlist.join('\n\n'))
    .setTimestamp(new Date())
    .setFooter(`Ran by ${message.author.tag}`, message.author.displayAvatarURL);
    message.channel.send(embed)
    return;
 }
 if(!client.uses[args[0]]) return assistant.error('Error', 'This command has no data to it.', message.channel);
 let command = client.uses[args[0]].amount;
 let percentage = calculate(command);
 let embed = new Discord.RichEmbed()
  .setColor('#42f4f4')
  .addField('Usage', `This command has **${command}** uses since last boot.`, true)
  .addField('Percentage of use', `Percentage Compared to other commands: ${percentage}%`);
  message.channel.send(embed)
  console.log(calculate(command))
  function calculate(cmd) {
   let list = [];
   let sum = 0;
   let product = 0;
   for(let i = 0; i < Object.keys(client.uses).length; i++) {
     let t = Object.keys(client.uses);
     let val = client.uses[t[i]].amount;
     list.push(val)
   }
   for(let i = 0; i < list.length; i++) {
    sum = sum + list[i];
   }
    console.log(sum)
    product = cmd / sum;
    product = product * 100;
    product = product.toFixed(2)
   return product;

  }
}
