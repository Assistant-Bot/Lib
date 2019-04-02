exports.setup = {
    'name' : 'settings',
    'aliases' : ['setting', 'modify', 'edit'],
    'usage' : '`settings view` - View your current server configuration.\n`settings <setting> <value>` - Change your setting value.\nPossible Settings: actionlog, modlog, mods, joinlog, welcome-message, leavelog, nicklog, userlogs, altlogs, cmd-delete, muterole, globalbans, prefix',
    'details' : 'Edit your server configuration.',
    'examples' : ['`settings modlog #channel`', '`settings log-all true` - If enabled, logs everything to your log-all channel.', '`settings log-all-channel #channel` - Sets the log-all channel'],
    'permission' : 2,
    'permissionTxt' : 'Server Administrator',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'Updates, This command will be updated soon.'
    }
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
 let settstr = 'actionlog, modlog, mods, joinlog, welcome-message, nicklog, userlogs, altlogs, cmd-delete, muterole, globalbans, prefix';
 settstr = settstr.split(', ');
 if(!args[0]) return message.channel.send(`${assistant.emoji.redtick} You need to provide a setting or operation. Use \`${message.guild.prefix}settings help\` if you are confused.`);
 let setting = args[0].toLowerCase();
 let subsetting = args[1];
 if(setting == "view") {
  let serversett = message.guild.settings;
  let usrmods = [];
  let mdroles = [];
  let joinlog = (serversett.member) ? `<#${serversett.member}>` : 'Disabled';
  let alllog = (serversett.all) ? `<#${serversett.all}>` : 'Disabled';
  let actionlog = (serversett.actionlog) ? `<#${serversett.actionlog}>` : 'Disabled';
  let modlog = (serversett.modlog) ? `<#${serversett.modlog}>` : 'Disabled';
  let usrlogs = (serversett.usrlog) ? `<#${serversett.usrlog}>` : 'Disabled';
  let welmsgc = (serversett.welmsg) ? `<#${serversett.welmsg.channel}>` : 'Disabled';
  let welmsg = (serversett.welmsg && serversett != null) ? serversett.welmsg.msg : 'No message found.';
  serversett.usermods.forEach(user => {
    let mem = message.guild.members.map(m => m.id);
    if(!mem.includes(user)) usrmods.push('UserLeft#0000');
    else usrmods.push(client.users.get(user).tag)
  });
  serversett.modroles.forEach(role => {if(!message.guild.roles.has(role)) return; mdroles.push(message.guild.roles.get(role).name)});
  if(usrmods.length < 1) usrmods.push('None');
  if(mdroles.length < 1) mdroles.push('None');
  let embed = new Discord.RichEmbed();
  embed.setColor(message.member.displayHexColor);
  embed.addField('Moderation', `UserMods: ${usrmods.join(', ')}\nMod Roles: ${mdroles.join(', ')}\nMute role: ${(serversett.muterole) ? serversett.muterole : 'No mute role.'}`);
  embed.addField('Log channels', `All Logs: ${alllog}\nAction Log: ${actionlog}\nModlog: ${modlog}\nMember Logs: ${joinlog}\nUser Logs: ${usrlogs}`);
  embed.addField("Welcome message -BETA", `Channel: ${welmsgc}\nMessage:\`\`\`${welmsg}\`\`\`\nExample msg: ${client.getVars(welmsg, "welmsg", message.member)}`)
  message.channel.send(embed)
  return;
 }
 if(setting == 'help') {
  let embed = new Discord.RichEmbed();
  embed.setColor(message.member.displayHexColor);
  embed.addField('Possible settings', 'actionlog, modlog, mods, joinlog, welcome-message, leavelog, nicklog, userlogs, altlogs, cmd-delete, muterole, globalbans');
  embed.addField('This command is a work in progress', '^^^^');
  return message.channel.send(embed);
 }
 if(setting == 'mods') return message.channel.send(`${assistant.emoji.redtick} Use \`${message.guild.prefix}addmod role/user <@mention>\` to add a mod to the list`);
 if(setting == 'actionlog') {
   if(!subsetting) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to provide a channel mention, id, or disable.`);
   subsetting = subsetting.replace(/[<,>,#]/g, "");
   if(!message.guild.channels.has(subsetting)) return message.channel.send(`${assistant.emoji.redtick} **Error:** I couldn't find that channel.`);
   let channel = message.guild.channels.get(subsetting);
   if(testSend(subsetting) == false) return message.channel.send(`${assistant.emoji.redtick} **Error:** It doesn't look like I can send messages in that channel.`);
   if(!message.guild.members.get(client.user.id).hasPermission("EMBED_LINKS")) return message.channel.send(`${assistant.emoji.redtick} **Error:** It doesn't look like I can send \`EMBED_LINKS\` in this channel.`);
   try {
      await assistant.database.write('settings', {parent: message.guild.id, child: "actionlog", value: channel.id});
      client.servers.delete(message.guild.id);
      message.channel.send(`${assistant.emoji.check} I set your action log channel to <#${subsetting}>`);
    } catch (err) {
      message.channel.send(`${assistant.emoji.redtick} **Error:** An internal error occured. Try joining the support server.\nMore information: \`\`\`xl${err}\`\`\``)
    }
   
  }
  if(setting == "welcome-message") {
    if(!args[1]) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to provide a setting: \`msg\`, \`disable\` or \`channel\`.`);
    let sett = args[1].toLowerCase();
    if(sett == "msg") {
      if(!args[2]) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to provide a message!`);
      let serversett = message.guild.settings;
      let msg = args.slice(2, args.length).join(" ");
      let welmsgc = (serversett.welmsg) ? serversett.welmsg.channel : null;
      await assistant.database.write('settings', {parent: message.guild.id, child: "welmsg", value: {channel: welmsgc, msg: msg}});
      client.servers.delete(message.guild.id);
      return message.channel.send(`${assistant.emoji.check} **Success!** Updated welcome message to: \`\`\`${msg}\`\`\``)
    }
    if(sett == "channel") {
      let serversett = message.guild.settings;
      let subsetting = (args[2]) ? args[2].toLowerCase() : false;
      if(subsetting == false) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to provide a channel mention, id, or disable.`);
      subsetting = subsetting.replace(/[<,>,#]/g, "");
      if(!message.guild.channels.has(subsetting)) return message.channel.send(`${assistant.emoji.redtick} **Error:** I couldn't find that channel.`);
      let channel = message.guild.channels.get(subsetting);
      if(testSend(subsetting) == false) return message.channel.send(`${assistant.emoji.redtick} **Error:** It doesn't look like I can send messages in that channel.`);
      if(!message.guild.members.get(client.user.id).hasPermission("EMBED_LINKS")) return message.channel.send(`${assistant.emoji.redtick} **Error:** It doesn't look like I can send \`EMBED_LINKS\` in this channel.`);
      try {
        let welmsg = (serversett.welmsg) ? serversett.welmsg.msg : null;
        await assistant.database.write('settings', {parent: message.guild.id, child: "welmsg", value: {channel: channel.id, msg: welmsg}});
        client.servers.delete(message.guild.id);
        return message.channel.send(`${assistant.emoji.check} I set your welcome-message channel to <#${subsetting}>`);
      } catch (err) {
        return message.channel.send(`${assistant.emoji.redtick} **Error:** An internal error occured. Try joining the support server.\nMore information: \`\`\`xl${err}\`\`\``)
      }
    }
  }
  if(setting == 'appealserver') {
    return message.channel.send(`${assistant.emoji.redtick} We're hyped for this too, but we're not quite ready yet.`);
  }
  if(setting == 'prefix') {
    let prefix = args.slice(1, args.length).join(' ');
    if(!prefix) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to provide a prefix.`);
    if(prefix.length > 3) return message.channel.send(`${assistant.emoji.redtick} **Error:** You can not have a prefix that is more than 3 characters.`);
    if(prefix.includes('`')) return message.channel.send(`${assistant.emoji.redtick} **Error:** You can not use that character in a prefix!`);
    try {
       await assistant.database.write('settings', {parent: message.guild.id, child: "prefix", value: prefix});
       client.servers.delete(message.guild.id);
       message.channel.send(`${assistant.emoji.check} Prefix is now set to: \`${prefix}\``);
     } catch (err) {
       message.channel.send(`${assistant.emoji.redtick} **Error:** An internal error occured. Try joining the support server.\nMore information: \`\`\`xl${err}\`\`\``)
     }
    return;
  }
  if(setting == "autorole") {
    if(!args[1]) return message.channel.send(`${assistant.emoji.redtick} **Error:** You need to \`remove\` or \`add\``);
    let tp = args[1].toLowerCase();
    let target = args.slice(2, args.length).join(' ');
    target = target.replace(/[@,!<>,]/g, '');
    //Checking and getting the user/role
    if(!parseInt(target)) {
        let s = search("role", target);
        if(!parseInt(s)) return s;
        else target = s;
    } else {
            let roles = message.guild.roles.map(r => r.id);
            if(!roles.includes(target)) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that role. Make sure that mention/id is from this server.`);
            else target = message.guild.roles.get(target).id;
    }
    try {
      if(!client.servers.get(message.guild.id).autorole) {
        let cache = client.servers.get(message.guild.id);
        client.servers.delete(message.guild.id);
        cache.autorole = []
        client.servers.set(message.guild.id, cache);
      }
      let t = client.servers.get(message.guild.id).autorole;
      if(tp == "add") {
        if(client.servers.get(message.guild.id).autorole.includes(target)) return message.channel.send(`${assistant.emoji.redtick} This role is already applied.`);
        t.push(target);
      }
      else {
        if(!client.servers.get(message.guild.id).autorole.includes(target)) return message.channel.send(`${assistant.emoji.redtick} This role is doesn't exist.`);
        t.splice(t.indexOf(target), 1);
      } 
      await assistant.database.write('settings', {parent: message.guild.id, child: "autorole", value: t});
      client.servers.delete(message.guild.id)
      return message.channel.send(`${assistant.emoji.check} Role has been added/removed to the autorole list!`);
    } catch (err) {
      return message.channel.send(`${assistant.emoji.redtick} An internal error occured. Join the support server for help.\n${err}`);
    }
  }
  if(setting == 'muterole') {
    return message.channel.send(`${assistant.emoji.redtick} This setting seems to be malfunctioning at the moment.`);
  }
  if(settstr.includes(setting)) return message.channel.send(`${assistant.emoji.redtick} This setting has not been added yet!`);
  else return message.channel.send(`${assistant.emoji.redtick} This is not a valid setting!`);

 /*Functions*/
async function testSend(id) {
  try {
   let m = await client.channels.get(id).send('Debugging');
   m.delete(200)
   return true;
  } catch (err) {
   return false;
  }
 }
 function search(t, query) {
  if(t == 'role') {
      let possible = [];
      let roles = message.guild.roles.map(r => r.id);
      roles.forEach(rid => {
          let name = message.guild.roles.get(rid).name;
          if(name.toLowerCase().search(query.toLowerCase()) != -1) return possible.push(rid);
      })
      if(possible.length == 0) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that role. Try being more specific.`);
      if(possible.length == 1) return possible[0];
      if(possible.length > 1) return  message.channel.send(`${assistant.emoji.redtick} There were **${possible.length}** results for that ${t}. Try being more specific.`);
  }
 }
}