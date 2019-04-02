{script:start}
let em = new Discord.RichEmbed();
em.setColor(msg.member.displayHexColor);
em.setAuthor('CC Documentation - sudo()')
em.addField(`Method - sudo`, "**`.sudo(`**_**`MemberId`**_**`,`**_**`commandString`**_**`)`**");
em.addField(`Parameters`, "**MemberId** - User Id string you get from discord.\n**commandString** - String with arguments for a command\n  -Example: `sudo('123456789', 'ping')` - Sudos the user with the id of *123456789* to run *ping*")
em.setFooter(`sudo(id, commandString) | Updated`);
em.setTimestamp(new Date());
msg.channel.send(em)
{script:end}