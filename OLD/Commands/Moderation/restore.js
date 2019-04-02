exports.setup = {
    'name' : 'restore',
    'aliases' : ['r'],
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
  let yes = (args[0]) ? true : false;
  let start = new Date();
  try {
  if(!yes) return message.channel.send(`${assistant.emoji.warning} **Warning:** The restoration process deletes **ALL** roles and channels in order for Assistant to properly restore the backup.\nThe backup this server will be restored to is: **${cache.backupID}** which was created at: ${new Date(cache.time).toLocaleDateString()}\n To confirm you wish to do this, please type \`${message.content} yes\``);
  let m = await message.channel.send(`${assistant.emoji.check} Initializing restoration process for backup: \`${cache.backupID}\``);
  let backup = await assistant.database.read('backups', {parent: cache.backupID});
  let channels = message.guild.channels.map(c => c);
  let roles = message.guild.roles.map(c => c);
    await m.edit(`${assistant.emoji.square} Restoring settings.`);
    //settings restore
    await message.guild.setName(backup.name, "Restore from backup");
    await message.guild.setDefaultMessageNotifications(backup.setDefaultNotifications, "Restore from backup");
    await message.guild.setExplicitContentFilter(backup.settings.explicitContent, "Restore from backup")
    //roles restore
    await m.edit(`${assistant.emoji.square} Restoring roles`);
    await roles.forEach(r => {
    try {
        r.delete();
        return;
        } catch (e) {
        return;
        };
    });
    await backup.roles.forEach(async role => {
        let newrole = await message.guild.createRole({
            name: role.name,
            color: role.color,
            hoisted: role.hoisted
        });
        await role.members.forEach(m => {
            try {
                if(!message.guild.members.has(m)) return;
                message.guild.members.get(m).addRole(newrole.id);
            } catch (error) {
                return;
            }
        })
    });

    await m.edit(`${assistant.emoji.square} Restoring channels now! (Will message in first text channel availible!)`);
    //restore channels
    await channels.forEach(async c => {
        try {
            c.delete();
            return;
        } catch (e) {
            return;
        };
    });
    let cacheChan;
    await backup.TextChannels.forEach(async channel => {
      let c = await message.guild.createChannel(channel.name, 'text');
      c.setPosition(parseInt(channel.postion));
      c.setTopic(channel.topic);
      c.setNSFW(channel.nsfw);
      cacheChan = c;
    });

    let endtime = new Date();
    if(cacheChan == null) return;
    await cacheChan.send(`${assistant.emoji.check} Restored **${backup.name}** successfully!\nTook: ${(endTime - startTime) / 1000} seconds.`)
  } catch (err) {
    console.log(err)
    m.edit(`${assistant.emoji.redtick} **${message.guild.name}** could not be restored up. This error was an internal error. Please contact a bot administrator in the support server located in the help menu.`);
  }
 
}