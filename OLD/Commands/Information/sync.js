exports.setup = {
'name' : 'sync',
'aliases' : [''],
'usage' : 'sync',
'details' : 'sync',
'permission' : 2,
'permissionTxt' : 'Server Administrator',
'antiTheft': false,
'enabled' : false,
'reason' : 'Server Unauthorized'
}
exports.run = async function(client, message, args, assistant) {
  if(args[0] == 'roletomember') {
   if(!client.guilds.get(args[1])) return assistant.error('Error', `The guild id is invaild at paramter 2 (!<sync roletomember **${args[1]}**)`, message.channel);
   let server1 = message.guild;
   let server2 = client.guilds.get(args[1]);
   for(let i = 0; i < server1.roles.map(r => r.name).length; i++) {
   }
  }
}
