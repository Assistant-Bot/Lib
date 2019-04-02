exports.setup = {
'name' : 'userinfo',
'aliases' : [''],
'usage' : 'Disabled',
'details' : 'Disabled',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true,
'reason' : 'disabled'
}

exports.run = async (client, message, args, assistant) => {
  let mem;
  if(!args[0]) mem = message.member;
  else {
      mem = args[0].replace(/[<,>,@,!]/ig, "");
      if(!message.guild.members.has(mem)) return message.channel.send(`${assistant.emoji.redtick} Member not found.`);
      mem = message.guild.members.get(mem);
  }
  let bot = (mem.user.bot) ? `${assistant.emoji.bot} ` : '';
  let color = (mem.displayHexColor != '#000000') ? mem.displayHexColor : '#42e2f4';
  let status = assistant.emoji[mem.user.presence.status];
  let game = (mem.user.presence.game != null) ? mem.user.presence.game : 'Not playing anything';
  let name = (mem.displayName != null) ? mem.displayName : mem.user.username;
  let mention = (mem.displayName != null) ? `<@!${mem.id}>` : `<@${mem.id}>`;
  let highr = (mem.highestRole == null) ? {name: "No roles assigned.", id: 0} : mem.highestRole;
  let hoistr = (mem.hoistRole == null) ? {name: "No roles assigned.", id: 0} : mem.hoistRole;
  let roles = (mem.roles.size <= 10) ? mem.roles.map(r => r.name).join(', ').replace("@everyone,", "") : `${mem.roles.size} Roles (Too large to list)`;
  let created = new Date(mem.user.createdAt).toDateString();
  let joined = new Date(mem.joinedAt).toDateString();

  let tags = client.getTags(mem.id).join(', ');

  console.log(tags)
    let Discord = require('discord.js');
    let watch_status = false;
    let embed = new Discord.RichEmbed();
        embed.setColor(color)
        embed.setAuthor(name, mem.user.displayAvatarURL);
        embed.setThumbnail(mem.user.displayAvatarURL);
        embed.addField('User Information', `Name: ${bot}${mention} (\`${mem.user.tag}\`)\nStatus: ${status}${game}\nAccount created: ${created}\n[Avatar Link](${mem.user.displayAvatarURL})`, true);
        embed.addField('User Guild Relation', `Display Name: ${name}\nJoined Guild: ${joined}\nHighest role: ${highr.name} (\`${highr.id}\`)\nHoisted role: ${hoistr.name} (\`${hoistr.id}\`)\nAll roles: ${roles}`, true);
        if(tags != 'No bot relations') embed.addField('Staff Ranks', tags);

    message.channel.send(embed);
}
