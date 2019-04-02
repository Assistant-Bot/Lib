{script:start}
 //0 is default (everyone), 1 is server mod, 2 is server admin, 3 is guild manager, 4 is guild owner
 let em = new Discord.RichEmbed();
 em.setColor(msg.member.displayHexColor);
 em.setAuthor('CC Documentation - Permission()')
 em.addField(`Here are the list of permission nodes.`, "Syntax: `permission(node)`\nNode: **0** - (Default) Everyone\nNode: **1** - Server Moderator (role or user) added with addmod command.\nNode: **2** Server Administrator (Discord Permission)\nNode: **3** - Guild Manager (Manage Guild Discord permission)\nNode: **4** - Guild Owner");
 em.setFooter(`Your permissions: ${msg.author.permission.join(', ')}. Updated`);
 em.setTimestamp(new Date());
 msg.channel.send(em)
{script:end}