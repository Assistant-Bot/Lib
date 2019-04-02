exports.setup = {
    'name' : 'invinfo',
    'aliases' : ['ii', 'inviteinfo', 'inv'],
    'usage' : `inv <link/code>`,
    'details' : 'Get information for an invite.',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  const Discord = require('discord.js');
  let code = (args[0]) ? args[0].replaceA(['discord.gg/', 'https://', 'discordapp.com/invite/'], "") : undefined;
  if(!code) return message.channel.send(`${assistant.emoji.redtick} Please provide an invite.`);
  try {
    let invite = await client.fetchInvite(`https://discord.gg/${code}`);
    let strexp = "";
    /*if(invite.expiresTimestamp == undefined || isNaN(invite.expiresTimestamp)) {
        strexp = "Never **N/A**";
    } else {
        let expires = assistant.getTime(new Date(), invite.expiresTimestamp);
        strexp = `**${expires.days}** days, **${expires.hours}** hours and **${expires.minutes}** minutes`;
    }*/
    let em = new Discord.RichEmbed();
    if(invite.inviter) {
        em.setAuthor(`Inviter: ${invite.inviter.tag}`, invite.inviter.displayAvatarURL);
        em.addField('Inviter', `${invite.inviter.tag} (\`${invite.inviter.id}\`)`, true)
    } else {
        em.setAuthor(`Inviter: Vanity URL`, 'https://esports-betting-tips.com/wp-content/uploads/2018/02/Discord-Logo-1200x1200.png');
        em.addField('Inviter', `Discord (\`0\`)`, true)      
    }
    invite.guild.iconURL = `https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`;
    invite.guild.splashURL = (invite.guild.splash) ? `https://cdn.discordapp.com/splashes/${invite.guild.id}/${invite.guild.splash}.png?size=2048` : undefined; 
    em.setColor(message.member.displayHexColor);
    em.addField('Guild', `${invite.guild.name} (\`${invite.guild.id}\`)`, true);
    em.addField('Members', invite.memberCount.toLocaleString('en'), true)
    em.addField('Channel', `${invite.channel.name} (\`${invite.channel.id}\`)`, true);
    em.addField('Invite Info', `**Url:** ${invite.url}\n**Code:** ${invite.code}`, true);
    if(invite.guild.splash) em.addField('Splash URL', `[Click Here for Splash](${invite.guild.splashURL})`, true);
    em.setThumbnail(invite.guild.iconURL)
    em.setFooter(invite.guild.name, invite.guild.iconURL)
    return message.channel.send(em);
  } catch (err) {
    console.log(err)
    return message.channel.send(`${assistant.emoji.redtick} Invalid invite link or code.`);
  }
}