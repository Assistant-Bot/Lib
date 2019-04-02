exports.setup = {
'name' : 'tban',
'aliases' : ['tb'],
'usage' : 'ban @Olybear9 being unbareable... - Bans @User for "being unbareable."',
'details' : 'Test command for server appeals.',
'permission' : 6,
'permissionTxt' : 'Developer',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
  let arg = message.content.split(" ");
  let ServerIcon = message.channel.guild.iconURL;
  let DATE = message.guild.createdAt;
  let Gon = message.guild.ownerID
  let user = message.mentions.members.first();
  let fs = require('fs');
  let accountfile = require('./bans.json')
  let usern = message.author.username
  let modid = message.author.id
  let memberdm = message.guild.member(user);
  let messagedd = arg.slice(2, 10000).join(" ")
  let perms = "admin"
  let bans = require('./ban.js')
  let sargs = ['-a', '-s'];
  let banid = undefined;
  let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  let randomletter = letters[Math.floor((Math.random() * letters.length))];
  let randomletter2 = letters[Math.floor((Math.random() * letters.length))];
  let randomletter3 = letters[Math.floor((Math.random() * letters.length))];
  let randomletter4 = letters[Math.floor((Math.random() * letters.length))];
  let randomletter5 = letters[Math.floor((Math.random() * letters.length))];
  let randomcode = `${randomletter}${randomletter2}${Math.floor((Math.random() * 78) + 1)}${Math.floor((Math.random() * 9) + 1)}${Math.floor((Math.random() * 9) + 1)}${randomletter3}${randomletter4}${Math.floor((Math.random() * 90) + 1)}${randomletter5}`
  banid = randomcode;
  if(bans[`${banid}`]) {
  return message.channel.send('error, ban id already exists, try the command again.');
  }
  if((message.guild.member(message.author).hasPermission("ADMINISTRATOR"))){
    perms = "Administrator"
  }
     if(!user)
     return message.reply("Please mention a valid member of this server");
     if(!user.bannable)
     return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  if(arg.includes('-a')) {
    bans[`${banid}`] = {
      'name' : user.user.tag,
      'guild' : message.guild.name,
      'reason' : messagedd
      }

    fs.writeFile('./bans.json', JSON.stringify(accountfile, null, 2), `utf8`, function (err) {
    if (err) return console.log(err)
    })
    message.channel.send('test banned user with the banid of: ' + banid);
  }
}
