exports.setup = {
    'name' : 'backup',
    'aliases' : ['backup'],
    'usage' : 'Backup',
    'details' : 'Potato',
    'permission' : 6,
    'permissionTxt' : 'Developer',
    'antiTheft': false,
    'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  if(client.backups.has(message.guild.id)) return message.channel.send(`${assistant.emoji.redtick} Please remove the current backup for this server: \`${client.backups.get(message.guild.id).backupID}\``);
  let m = await message.channel.send(`${assistant.emoji.square} **Starting** Backup started, this may take a while depending on how large the server is, and the members in the server. This message will be updated once completed.`);
  let guild = await message.guild;
  let startTime = new Date();
  let roles = guild.roles.map(r => r);
  let members = guild.members.map(m => m);
  let TextChannels = guild.channels.filter(c => c.type == 'text').map(c => c);
  let VoiceChannels = guild.channels.filter(c => c.type == 'voice').map(c => c);
  let CategoryChannels = guild.channels.filter(c => c.type == 'category').map(c => c);
  let owner = guild.owner;
  let defaultNotifications = guild.defaultMessageNotifications;
  let verificationLevel = guild.verificationLevel;
  let explicitContent = guild.explicitContentFilter;
  let id = assistant.genID();
  let backup = {};
  /* The Actual stuff :) */
  backup.name = message.guild.name;
  backup.owner = owner.user.id;
  backup.settings = {
    afkChannel: null,
    defaultNotifications: defaultNotifications,
    verficationLevel:  verificationLevel,
    explicitContent: explicitContent,
    twofa: guild.mfaLevel,
    icon: guild.iconURL //USE BISOGA UPLOADER SOON
  };
  backup.roles = [];
  backup.TextChannels = [];
  backup.VoiceChannels = [];
  backup.Categories = [];
  // Backup all current bans by ids
  backup.bans = [];
  await guild.fetchBans().then(async bans => {
   bans = bans.map(u => u.id);
   await bans.forEach(ban => {
       backup.bans.push(ban)
    });
  });
 //Backup all roles with users
 await Object.keys(roles).forEach(r => {
     r = roles[r];
     let mems = r.members.map(m => m.id);
     let role = {
         name: r.name,
         permissions: [],
         position: r.position,
         id: r.id,
         color: r.hexColor,
         mentionable: r.mentionable,
         hoisted: r.hoist,
         members: mems
     }
     backup.roles.push(role);
 })
 
 //Backup all text channels
 await Object.keys(TextChannels).forEach(async c => {
     c = TextChannels[c];
     let channel = {
        name: c.name,
        id: c.id,
        topic: c.topic,
        nsfw: c.nsfw,
        position: c.position,
        permissions: []
      };
      let perms = c.permissionOverwrites.map(o => o);
     await perms.forEach(item => {
         /* if(item.type == 'member') {
              channel.permissions.push({
               member: item.id,
               allowed: [],
               denied: [],
              })
          } else {
            channel.permissions.push({
                role: item.id,
                allowed: [],
                denied: []
               })
          }*/
      });
      backup.TextChannels.push(channel);
  });
  try {
    await assistant.database.write('backups', {parent: id, main: backup});
    let newback = await assistant.database.read('backups', {parent: "1", child: 'servers'});
    let bk = {
        backupID: id,
        guild: guild.id,
        user: message.author.id,
        time: `${new Date()}`
    };
    newback.push(bk);
    await assistant.database.write('backups', {parent: "1", child: 'servers', value: newback});
    let endTime = new Date();
    client.backups.set(guild.id, bk);
    await m.edit(`${assistant.emoji.check} **${message.guild.name}** has been backed up with the backup id of: \`${id}\`!\nTook: **${(endTime - startTime) / 1000}** seconds.\nBacked up: \`${roles.length}\` roles, \`${message.guild.channels.size}\` channels and \`${members.length}\` members. (All guild settings are also saved.)`);
  } catch (err) {
    console.log(err)
    m.edit(`${assistant.emoji.redtick} **${message.guild.name}** could not be backed up. This error was an internal error. Please contact a bot administrator in the support server located in the help menu.`);
  }
 
}