exports.setup = {
'name' : 'purge',
'aliases' : [''],
'usage' : 'purge @Olybear9 10 - Remove messages send by @User\npurge bots - Remove all messages from bots.\npurge match test - Purges 100 messages that have "test"',
'details' : 'Purge messages from a channel based on mass or content.',
'permission' : 2,
'permissionTxt' : 'Server Administrator',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  let length = args[0];
  let opt = ['match', 'bots'];
  if(opt.includes(args[0])) {
  length = 100;
  }
  let obj = await message.channel.fetchMessages({limit: length});
  let messages = obj.map(m => m);
  let m2d = [];
  let content = args.slice(1, args.length).join(' ');
  if(args[0] == 'match') {  
    obj = await message.channel.fetchMessages({limit: length});  
    for(let x = 0; x < messages.length; x++) {
      if(messages[x].content.includes(content)) {
      m2d.push(messages[x])
      }
    }
    message.channel.bulkDelete(m2d);
  } else if(args[0] == 'bots') {
    obj = await message.channel.fetchMessages({limit: length});  
    for(let x = 0; x < messages.length; x++) {
      if(messages[x].author.bot) {
      m2d.push(messages[x])
      }
    }
    message.channel.bulkDelete(m2d);
  } else if(message.mentions.members.first()) {
    if (parseInt(args[0]) > 99) {
      return assistant.error('Error', `Length must be less than 100`, message.channel);
    }
    let objd = await message.channel.fetchMessages({limit: 100}); 
    let messages2 = objd.map(m => m);
    let user = message.mentions.members.first();
    for(let x = 0; x < parseInt(args[0]) && x < length; x++) {
        if(messages2[x].author.id == user.id) {
        m2d.push(messages2[x])
        }
    }
    message.channel.bulkDelete(m2d);
    message.author.send(`Purged: **${m2d.length}** Messages sent by: **${user.user.tag}**.`)
  } else {
   message.channel.bulkDelete(parseInt(args[0]) + 1)
  }
}
  