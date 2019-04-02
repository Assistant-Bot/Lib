{script:start}
 assistant.vars.msg2 = "";
  let em = new Discord.RichEmbed();
if(!findRole('notifications')[0].id) msg.channel.send("Role don't exist.");
if(user.roles.has(findRole('notifications')[0].id)) {
  user.removeRole(findRole('notifications')[0].id);
  assistant.vars.msg2 = "unsubscribed from notifications. We'll miss you :(";
  em.setColor('#ff0000')
} else {
  user.addRole(findRole('notifications')[0].id);
  assistant.vars.msg2 = "subscribed to notifications! Thanks for staying up to date with assistant!!";
  em.setColor('#42f44e')
}
  em.addField('Notifications', `You, ${assistant.vars.msg2}\n**Tip:** To revert this, use the updates command again.`);
  em.setAuthor(msg.author.username, msg.author.displayAvatarURL)
 msg.channel.send(em)
{script:end}