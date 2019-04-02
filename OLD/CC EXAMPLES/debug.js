{script:start}
 let g = msg.guild.settings;
 let em = new Discord.RichEmbed();
 em.setColor('#ff0000');
 em.addField('setting debugger', `BetaGuild: ${g.betaGuild}\nCustom Commands: \`${Object.keys(g.customcmd).join('`, `')}\`\nMod Roles: ${g.modroles}\nUsermods: ${g.usermods}\nPrefix: ${g.prefix}`);
 msg.channel.send(em)
{script:end}