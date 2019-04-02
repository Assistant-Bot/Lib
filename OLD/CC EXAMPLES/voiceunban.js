{script:start}
permission(1); //moderator
assistant.vars.msg2 = "";
let em = new Discord.RichEmbed();

if(!args[0]) return msg.channel.send(`${assistant.emoji.redtick} Mention a member.`);
let usr = args[0].replace(/[<,>,!,@]/ig, "");
let r = (args[1]) ? args.slice(1).join(' ') : "No Reason Provided";
if(!parseInt(usr)) return msg.channel.send(`${assistant.emoji.redtick} Mention a member.`);
if(!msg.guild.members.has(usr)) return msg.channel.send(`${assistant.emoji.redtick} Invalid Member`);
usr = msg.guild.members.get(usr);

if(!findRole('Voice Ban')[0].id) msg.channel.send("Role doesn't exist.");
if(usr.roles.has(findRole('Voice Ban')[0].id)) {
    usr.removeRole(findRole('Voice Ban')[0].id);
    assistant.vars.msg2 = `**${msg.member.user.username}** Voice Unbanned: \`${usr.user.username}\`\nReason: ${r}`;
    em.setColor('#42f44e')
    em.addField('Voice Unban', `**Moderator:** ${msg.member}\n**Reason:** ${r}`);
    em.setFooter("Performed");
    em.setTimestamp(new Date());
    em.setAuthor(usr.user.username, usr.user.displayAvatarURL);
    msg.guild.channels.get('463907330745040897').send(em);
} else {
    em.setColor('#ff0000');
    assistant.vars.msg2 = "This user is not banned."
    return;
}
{script:end}
$msg2