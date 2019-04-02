exports.setup = {
'name' : 'reload',
'aliases' : [''],
'usage' : 'Nothing defined here.',
'details' : 'Could not find variable.',
'permission' : 6,
'permissionTxt' : 'Developer',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args) => {
  message.reply(`Reloading all commands!`);
  await client.reloadCommands();
  message.channel.send('Reloaded all commands!');
};
