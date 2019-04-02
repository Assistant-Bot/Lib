exports.setup = {
'name' : 'command',
'aliases' : ['cmd'],
'usage' : 'command <command> <enable/disable>',
'details' : 'Enable or disable a command.',
'permissionTxt' : 'Developer',
'permission': 6,
'enabled' : true,
'reason' : 'Broken'
}
exports.run = async (client, message, args, assistant) => {
  let fs = require('fs');
  if(!args[0]) return;
  let command = args[0];
  let choice;
  let reason = args.slice(2, args.length).join(' ') || 'No reason provided.';
  let noDisable = ['command']
  if(!args[1]) return assistant.error('Error', `The command you attempted to modify could not be changed`, message.channel);
  if(noDisable.includes(args[0].toLowerCase())) return assistant.error('Error', `You can not disable this command because it is a **core** command.`, message.channel);
  if(args[1].toLowerCase() == 'disable' || args[1].toLowerCase() == 'enable') {
   if(args[1].toLowerCase() == 'disable') {
        choice = false;
      } else {
        choice = true;
      }
  } else {
    return assistant.error('Error', `The command you attempted to modify could not be changed`, message.channel);
  }
  if(!client.commands.has(command)) return assistant.error('Error', `The command you attempted to modify was not found.`, message.channel);
    let file = client.commands.get(command);
    client.commands.delete(command);
    if(file.aliases) {
      file.aliases.forEach(al => {
        client.commadns.delete(al)
      })
    }
    file.setup.enabled = choice;
    file.setup.reason = reason;
   assistant.success(`${args[1]}d ${command}!`, message.channel)
 
 }
