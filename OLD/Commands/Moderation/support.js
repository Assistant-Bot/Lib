exports.setup = {
'name' : 'support',
'aliases' : [''],
'usage' : 'support - Use our precoded help system',
'details' : 'Ask Assistant for support on your server. (If you still need help it will generate a invite with permission.)',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}

exports.run = async function(client, message, args) {
  const Discord = require('discord.js')
  message.channel.send('What do you need help with?\n**Server**, **Bot**, **Other**')
  let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
  let configEmbed = new Discord.RichEmbed()
    .addField('How to use server configuration.', 'Brief: `server settings`, `server icon`, `server members`, `server bans`')
    .addField('Server settings Arguments', '`edit <modlog / modrole> <id / name / or "here">` - Change value for modlog or modrole.\n`edit <autodelete/bannedwords> <true/false>` - Change value for autodelete or bannedwords.')
    .addField('Server arguments (All arguments)', '`iconrul`, `members.bots`, `members`, `members.human`, `bans`, `bans find`, `owner`, `permission.level`')
    .setColor('#fe0000');
            collector.on('collect', message => {
                if (message.content.toLowerCase() == "server") {
                    message.channel.send("**Server** (reply with one of the following):\n**Config**, **More help**, **Cancel**");

                  let collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    collector.on('collect', async message => {
                           if(message.content.toLowerCase() == 'cancel'){
                              return message.reply('Canceled request');
                            } else if(message.content.toLowerCase() == 'more help'){
                              var m = await message.channel.send('Please make sure I have invite permissions, creating an invite for a bot support member in 5 seconds');
                              setTimeout(function(){
                              m.edit('<:check:346685847552393226> Attempting to create invite...');
                                  message.channel.createInvite().then(invite =>
                                    client.channels.get('408145547090722837').send('<@&381218768799531010>') &&
                                    client.channels.get('408145547090722837').send(
                                    new Discord.RichEmbed()
                                        .setColor('#ff0000')
                                        .addField(`Support Request`, `${message.author.tag} created this ticket on: ${new Date().toDateString()}`)
                                        .addField('Guild Information', `Owner: ${message.guild.owner.user.tag}\nName: ${message.guild.name}(${message.guild.id})`)
                                        .addField('Invite', `${invite}`)
                                        .setAuthor(client.user.tag, client.user.avatarURL)
                                        .setFooter('Support request ticket'))).catch(err =>  m.edit('<:redtick:346685858318909440> Invite could not be created. Try checking my permissions and try again.'))
                                    m.edit('<:check:346685847552393226> Invite created!');
                                  return;
                            }, 5000);
                          } else if(message.content.toLowerCase() == 'config'){
                            message.channel.send(configEmbed)
                            }

                        })
                } else if (message.content.toLowerCase() == "bot") {
                    message.channel.send("Bot response");
                } else if (message.content.toLowerCase() == "other") {

                }
            })
}
