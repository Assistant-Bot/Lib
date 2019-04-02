exports.setup = {
    'name' : 'delmod',
    'aliases' : ['dmod'],
    'usage' : '`delmod user @user` - Add a user to your mods list.\n`delmod role roleid/search` - Remove a role to the mods list.',
    'details' : 'Remove a mod role or user to your server',
    'examples' : [''],
    'permission' : 2,
    'permissionTxt' : 'Server Administrator',
    'antiTheft': false,
    'enabled' : true,
    'reason' : 'Updates, This command will be updated soon.'
    }
const Discord = require('discord.js');
exports.run = async (client, message, args, assistant) => {
try {
  if(!args[0]) return message.channel.send(`${assistant.emoji.redtick} Provide \`user\` or \`role\`\nUse: \`help delmod\` if confused.`);
  let type = args[0].toLowerCase();
  if(type != 'role' && type != 'user') return message.channel.send(`${assistant.emoji.redtick}**Invalid option:** Provide \`user\` or \`role\`\nUse: \`help addmod\` if confused.`);
  if(!args[1]) return message.channel.send(`${assistant.emoji.redtick} Provide a mention, or search to add a ${type} to the mod list.`);
  let target = args.slice(1, args.length).join(' ');
  target = target.replace(/[@,!<>,]/g, '');
  //Checking and getting the user/role
  if(!parseInt(target)) {
      let s = search(type, target);
      if(!parseInt(s)) return s;
      else target = s;
  } else {
      if(type == 'role') {
          let roles = message.guild.roles.map(r => r.id);
          if(!roles.includes(target)) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that role. Make sure that mention/id is from this server.`);
          else target = message.guild.roles.get(target).id;
      }
      if(type == 'user') {
        let members = message.guild.members.filter(member => member.user.bot == false).map(m => m.id);
        if(!members.includes(target)) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that member. Make sure that they are in this server.`);
        else target = message.guild.members.get(target).id;   
      }
  }
  try {
    if(type == 'user') type = 'usermods';
    if(type == 'role') type = 'modroles';
    if(!client.servers.get(message.guild.id)[type].includes(target)) return message.channel.send(`${assistant.emoji.redtick} Moderator type not found.`);
    let t = client.servers.get(message.guild.id)[type];
    t.splice(t.indexOf(target), 1);
    await assistant.database.write('settings', {parent: message.guild.id, child: type, value: t});
    client.servers.delete(message.guild.id)
    message.channel.send(`${assistant.emoji.check} **${getName(target, type)}** has been removed from the modlist!`);
  } catch (err) {
    return message.channel.send(`${assistant.emoji.redtick} An internal error occured. Join the support server for help.\n${err}`);
  }
  function search(t, query) {
    if(t == 'role') {
        let possible = [];
        let roles = message.guild.roles.map(r => r.id);
        roles.forEach(rid => {
            let name = message.guild.roles.get(rid).name;
            if(name.toLowerCase().search(query.toLowerCase()) != -1) return possible.push(rid);
        })
        if(possible.length == 0) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that ${type}. Try being more specific.`);
        if(possible.length == 1) return possible[0];
        if(possible.length > 1) return  message.channel.send(`${assistant.emoji.redtick} There were **${possible.length}** results for that ${t}. Try being more specific.`);
    }
    if(t == 'user') {
        let possible = [];
        let roles = message.guild.members.map(r => r.id);
        roles.forEach(rid => {
            let name = message.guild.members.get(rid);
            if(name.name != null && name.name.toLowerCase().search(query.toLowerCase()) != -1) return possible.push(rid);
            else if(name.user.tag.toLowerCase().search(query.toLowerCase()) != -1) return possible.push(rid);
            else return;
        })
        if(possible.length == 0) return message.channel.send(`${assistant.emoji.redtick} I couldn't find that ${type}. Try being more specific.`);
        if(possible.length == 1) return possible[0];
        if(possible.length > 1) return  message.channel.send(`${assistant.emoji.redtick} There were **${possible.length}** results for that ${t}. Try being more specific.`);
    }

  }
  function getName (id, t) {
   if(t == 'usermods') {
       return message.guild.members.get(id).user.username;
   }
   else return message.guild.roles.get(id).name
  }
} catch (err) {
    return message.channel.send(`${assistant.emoji.redtick} An internal error occured. Join the support server for help.\n${err}`);
}
}