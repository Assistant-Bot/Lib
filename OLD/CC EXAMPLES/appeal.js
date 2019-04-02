//accepted!
{script:start}
 let u = msg.content.split(" ")[1].replace(/[!,@,<,>]/ig, "");
 let em = new Discord.RichEmbed();
 em.setColor('#58fc05');
 em.addField('Appeal accepted by staff', "You're appeal was accepted! You can join the [ownage discord](https://discord.gg/ey5F3YP)/server now!\n**[Click here to join the Discord](https://discord.gg/ey5F3YP)**")
 msg.guild.members.get(u).send('**Make sure you have `embed_links` enabled in settings to see the links below**');
 msg.guild.members.get(u).send(em);
msg.guild.members.get(u).kick();
{script:end}