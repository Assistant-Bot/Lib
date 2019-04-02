exports.setup = {
    'name' : 'unban',
    'aliases' : ['ub', 'unb'],
    'usage' : 'unban user oopsie... - Unbans user for "oopsie..."',
    'details' : 'Ban a user from the server.',
    'permission' : 1,
    'permissionTxt' : 'Server Moderator',
    'antiTheft': false,
    'enabled' : true
    }
const Discord = require('discord.js');
exports.run = async function(client, message, args, assistant) {
    let usr = (!args[0]) ? undefined : args[0].replace(/<,>,@,!/ig, "");
    if(message.guild.members.get(client.user.id).hasPermission('BAN_MEMBERS') == false) return message.channel.send(`${assistant.emoji.redtick} I need permission to ban members to perfom this command.`);
    if(!usr) return message.channel.send(`${assistant.emoji.redtick} You need to provide a user to unban.`);
    message.guild.fetchBans().then(bans => {
       let bane = bans.map(b => b);
       let result = false;
       bane.forEach(ban => {
       if(result != false) return;
           if(ban.username.toLowerCase().search(usr) != -1 || ban.id == usr) {
               result = ban;
           } else return;
       });
       if(result == false) {
           message.channel.send(`${assistant.emoji.redtick} No result found for your search query.`)
       } else {
               message.guild.unban(result.id).then(usr => message.channel.send(`${assistant.emoji.check} Successfully Unbanned: ${usr.username}`));
       }
    })
}
    
