{script:start}
 assistant.vars.msg2 = "";
  let em = new Discord.RichEmbed();
if(!findRole('Volunteer Squad')[0].id) msg.channel.send("Role don't exist.");
if(user.roles.has(findRole('Volunteer Squad')[0].id)) {
  user.removeRole(findRole('Volunteer Squad')[0].id);
  assistant.vars.msg2 = "left the **Volunteer Squad**. We'll miss you!";
  em.setColor('#ff0000')
} else {
  user.addRole(findRole('Volunteer Squad')[0].id);
  assistant.vars.msg2 = "joined the **Volunteer Squad**! You can now be mentioned by players and help them with their questions! (This will help you get staff)";
  em.setColor('#42f44e')
}
  em.addField('Volunteer Squad', `You, ${assistant.vars.msg2}\n**Tip:** To revert this, use the command again.`);
  em.setAuthor(msg.author.username, msg.author.displayAvatarURL)
 msg.channel.send(em)
{script:end}