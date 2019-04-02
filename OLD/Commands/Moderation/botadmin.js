exports.setup = {
'name' : 'botadmin',
'aliases' : ['botadmin', 'ba'],
'usage' : 'botadmin args1, args2',
'details' : "`Available commands:`\n`getinfo guildid` - returns information about the guild.\n`geninv guildid` - generates a invite for that guild.\n`mutuals @mention` - returns information on the mentioned user.\n`error <errID>` - Retrieve information on a specific error.",
'permission' : 5,
'permissionTxt' : 'Bot Administrator',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
const Discord = require('discord.js')
try {
      if(args[0] === "geninv") {
       try {
      if(!client.guilds.get(args[1])) return assistant.error('Error', `That guild does not exist, or I am not in it.`, message.channel);
      let channel = filterPerms('channel', args[1]);
      let gname = client.guilds.get(args[1]).name;
      if(channel == 'No perms.')
      return assistant.error('No permissions', `I could not generate a invite for the server: ${gname}`, message.channel);
        client.channels.get(channel).createInvite().then(inv => {message.channel.send(`I generated an invite for **${gname}**\nLink: ${inv}`)})
        } catch (err) {
        return message.channel.send(`The bot admin command failed because of: \`${err}\``)
        }
      } else if(args[0] === "getinfo") {
        try {
        let guild = client.guilds.get(args[1])
        message.channel.send( new Discord.RichEmbed()
        .setColor('#42e8ff')
        .setAuthor(guild.owner.user.tag, guild.owner.user.avatarURL)
        .setThumbnail(guild.iconURL)
        .setTitle(guild.name)
        .setDescription(`Owner: ${guild.owner.user.tag}`)
        .addField("Member count", guild.memberCount, true)
        .addField("Humans", guild.memberCount - guild.members.filter(m=> m.user.bot === true).size, true)
        .addField("Bots", guild.members.filter(m=> m.user.bot === true).size, true)
        .addField("Date created", guild.createdAt, true)
        .addField("Guild information", `Name: ${guild.name}\nID: ${guild.id}`)
        )
        } catch (err) {
        message.channel.send("That guild id is invaild, or does not exist, or I am not in that server.")
      }
      } else if(args[0] === 'error') {
        let err = args[1];
        if(!client.errors.has(err)) return message.channel.send(`${assistant.emoji.redtick} **Error:** Invalid error id.`);
        else {
          let embed = new Discord.RichEmbed();
          let error = client.errors.get(err);
          let m = error.msg;
          embed.setColor('#00fffa');
          embed.setAuthor(`Error ID: ${err}`, m.guild.iconURL);
          embed.addField(`Error Details`, `**Occured on command:** \`${error.command}\`\n**Occured in channel:** <#${m.channel.id}> (\`${m.channel.id}\`)\n**Guild:** ${m.guild.name} (\`${m.guild.id}\`)\n**By User:** ${m.author.tag} (\`${m.author.id}\`)\n**Content:** \`\`\`${m.content}\`\`\``);
          embed.addField(`Full Error:`, `\`\`\`xl\n${error.error}\n\`\`\``);
          message.channel.send(embed)
        }
      } else if(args[0] === "mutuals"){
        try {
        let member = message.mentions.members.first();
        message.channel.send(new Discord.RichEmbed()
                .setColor('#42e8ff')
                .addField("That users info:", `**Name:** ${member.user.tag}\n**Created:** ${member.user.createdAt}\n**Nitro:** ${member.user.fetchProfile().premium}\n**Status:** ${member.user.presence.status}`)
                .addField(`${member.user.tag} has these guilds with me`, `\`\`\`${client.guilds.filter(g => g.members.get(member.id)).map(g => `${g.name} (${g.id})`).join('\n')}\`\`\``))
        } catch (err) {
        message.channel.send(`The command failed because of the error: \`${err}\``)
        }
      } else {
        return message.reply("Please use: help botadmin");
      }
  } catch (err) {
        message.channel.send(`The command failed because of the error: \`${err}\``)
  }
  function filterPerms(type, id) {
   if(type == 'channel') {
    let channels = client.guilds.get(id).channels.filter(c => c.type == 'text').map(c => c.id);
    let channel = undefined;
      for(let i = 0; i < channels.length; i++) {
        console.log(channels[i])
          if(client.channels.get(channels[i]).permissionsFor(client.guilds.get(id).me).has('CREATE_INSTANT_INVITE')) {
           return channels[i];
          } else {
            channel = 'No perms.';
            continue;
          }
      }
      return channel;
    }

   }
}
