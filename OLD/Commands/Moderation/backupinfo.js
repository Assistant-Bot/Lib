exports.setup = {
    'name' : 'backupinfo',
    'aliases' : ['bi', 'binfo'],
    'usage' : 'Backup',
    'details' : 'Potato',
    'permission' : 6,
    'permissionTxt' : 'Developer',
    'antiTheft': false,
    'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  if(!client.backups.has(message.guild.id)) return message.channel.send(`${assistant.emoji.redtick} Please create a backup for this server!`);
  let cache = client.backups.get(message.guild.id);
  let backup = await assistant.database.read('backups', {parent: cache.backupID});
  let roles = [];
  let channels = [];
  backup.roles.forEach(role => roles.push(role.name));
  backup.TextChannels.forEach(channel => channels.push(channel.name));
  let m = await message.channel.send(`${assistant.emoji.square} Gathering data for: \`${cache.backupID}\``);
  m.edit(`${assistant.emoji.check} Showing settings for backup!`)
  message.channel.send(`**\`\`\`diff\n+ Name: ${backup.name}\n- Time: ${new Date(cache.time).toDateString()} at ${new Date(cache.time).toLocaleTimeString()}\n- BackupID: ${cache.backupID}\n- Explicit Content: ${backup.settings.explicitContent}\n- Verification Level: ${backup.settings.verficationLevel}\n- Notifications: ${backup.settings.defaultNotifications}\n+ Channels: ${channels.length}\n- Channel names: ${channels.join(', ')}\n+ Roles: ${backup.roles.length}\n- Role names: ${roles.join(', ')})\`\`\`**`, {split: true})
}