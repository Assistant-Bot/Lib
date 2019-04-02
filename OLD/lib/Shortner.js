require('discord.js');
module.exports = {
  
  send: function(textChannel, sendValue) {
    this.textChannel = textChannel;
    this.sendValue = sendValue;
    textChannel.send(sendValue)
  },
  
  MemberPermissions: function(user, guild, permissions) {
    if(guild.member(user).hasPermission(permissions)) return true;
    if(!guild.member(user).hasPermission(permissions)) return false;
  },
  
 /* autoMod: function(data) {
  require('discord.js');
  let server = serverData[`${data.guild.id}`];
  let link = '://'
  let invite = 'disco'
  let ext = ['.com', '.net', '.me', '.uk', '.org', 'https://', 'http://']
  if (!server) {
    serverData[`${data.guild.id}`] = {
      'bannedwords' : [],
      'bannedlinks' : [],
      'moderate' : {
          'bannedWords' : false,
          'bannedLinks' : false,
          'links' : false,
          'invites' : false
        },
      'moderate' : {
       'bannedwords' : false,
       'bannedlinks' : false,
       'links' : false,
       'invites' : false
      }
      
    };
  }
   let moderate = server.moderate;
   let x = data.content.toLowerCase();
   let falsify = false;
        function bannedWords(data2){
        if(data2.author.id == client.user.id) return;
         data2.delete(200);
         data2.channel.send('You cant use say that word');
         falsify = true;
        }
        function bannedLinks(data2){
         data2.delete(200);
         data2.channel.send('You cant use say that word');
         falsify = true;
        }
        function llink(data2){
         data2.delete(300);
         data2.reply('Links are banned');
         falsify = true;
        }
        function iinvite(data2) {
         data2.delete(200);
         data2.reply('No invites...')
         falsify = true;
        }
     let invitesList = ['.gg/', '.io/', 'invite/', '/invite', 'gg/', 'io/']
      if(x.search('://') != -1 && moderate.links == 'true')
        return llink(data);
      if(x.inviteResolvable)
        return iinvite(data);
    for(let i in invitesList) {
        if(x.trim().split(' ').join('').search(invitesList[i]) != -1 && moderate.invites == 'true')
          return iinvite(data);
    }
    for(let i in ext) {
      if(x.trim().split(' ').join('').search(ext[i]) != -1 && moderate.links == 'true')
        return llink(data);    
    }
    for(let i in server.bannedwords) {
      if(x.trim().split(' ').join('').search(server.bannedwords[i].toLowerCase()) != -1 && moderate.bannedwords == 'true')
        return bannedWords(data);
      if(x.trim().split(' ').join('').search(server.bannedlinks[i]) != -1 && moderate.bannedlinks == 'true')
        return bannedLinks(data);
    }
  } */

}