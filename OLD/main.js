require('advanced-string')
let Discord = require('discord.js');
let client = new Discord.Client();
let config; //let config = database.config;
let token; //let token = database.token
//let reload = require('./express.js')
let fs = require('fs');
client.commands = new Discord.Collection();
client.analisis = new Discord.Collection();
client.servers = new Map();
client.errors = new Map();
client.queues = new Map();
client.backups = new Map();
var details = [];
var moderation = [];
var misc = [];
var addons = [];
//#36393f
const assistant = require('./assistant/functions.js');
const appeals = require('./appeals/index.js');
const snekfetch = require('snekfetch')
setInterval(() => {
  if(client.user.id == '414493146588905497') return;
  snekfetch.post(`https://discordbots.org/api/bots/stats`)
    .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0NDUwNjQzMjIyMzE4Mjg0OCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTExNDA0NjU4fQ.ZF_Fxz8bH5N10d_qJUwN6_dCFchsPiAcwWYnS_ErrU0')
    .send({ server_count: client.guilds.size })
    .then(() => console.log('Sent'))
    .catch(err => console.error(`Whoops something went wrong: ${err.body}`))
    console.log('Ran setInterval for DBL');
}, 3600000)

function read(fld, type){
  fs.readdir("./"+fld+"/", (err, files) => {
      if (err) console.error(err);
      let jsfiles = files.filter(f => f.split(".").pop()==="js")
      jsfiles.forEach(f => {
let props = require(`./`+fld+`/${f}`);
delete require.cache[require.resolve(`./`+fld+`/${f}`)];
          if(!props.setup) return console.error(`WARNING: A command in ${fld} (${f}) did not have a setup object, so it couldn't be added. (Ignored Error)`);
          if(!props.setup.name) return console.error(`WARNING: A command in ${fld} did not have a name, so it couldn't be added. (Ignored Error)`);
          client.commands.set(props.setup.name, props);
          if(!props.setup.aliases) return console.error(`WARNING: ${props.setup.name} was loaded, but no aliases were loaded with it because setup.aliases could not be found`);
        if(Array.isArray(props.setup.aliases) == false) {
          console.error(`WARNING: ${props.setup.name} was loaded but no aliases were loaded with it because the aliases provided was not a array.`);
          return;
        }
        props.setup.aliases.forEach(aliase => {
            client.commands.set(aliase, props)
             if(type) {
              if(Array.isArray(type)) type.push(aliase);
              else console.error(`WARNING: ${props.setup.aliase} successfully loaded but an invalid array was provided.`)
             }
          }) 
          console.log(`${props.setup.name} loaded successfully with: ${props.setup.aliases.length} aliases!\n|- ${props.setup.aliases.join(' \n|- ')}`)
      });
  });
}
client.uses = {};
function ran(command) {
  if(!client.uses[command]) {
    client.uses[command] = {
      'amount' : 1
    };
    console.log(`${command} Has been setup.`)
  } else {
  client.uses[command].amount++;
  console.log(`${command} Now has: ${client.uses[command].amount}`)
 } 
}

read('Commands/Moderation')
read('Commands/Information')
read('Commands/Miscellaneous')
//read('Commands/Addons', addons)
client.reloadCommands = async function() {
  await client.commands.forEach(async (data, command, none) => {
    await client.commands.delete(command)
  });
  read('Commands/Moderation')
  read('Commands/Information')
  read('Commands/Miscellaneous')
}

client.on('ready', async () => {
  let backups = await assistant.database.read('backups', {parent: '1', child: "servers"});
  backups.forEach(backup => {
    client.backups.set(backup.guild, backup);
  })
  console.log(`Assistant v1.0.1 logged in with: ${client.guilds.size} guilds and ${client.users.size} users.`);
  if(client.user.id != '414493146588905497') client.channels.get('497605334928588800').send(`Assistant v1.0.1 started with ${client.guilds.size} servers.`)
      client.user.setPresence({
          game: {
            name: `${client.guilds.size} servers | @Assistant | v1.0.1`,
            type: 'WATCHING'
          },
         status: 'online'
        });
})
  setInterval(() => {
      client.user.setPresence({
          game: {
            name: `${client.guilds.size} servers | @Assistant | v1.0.1`,
            type: 'WATCHING'
          },
         status: 'online'
        });
    }, 900000);
client.on("guildCreate", guild => {
  let guildownera = client.guilds.get(`${guild.id}`).owner.id
  client.channels.get('497824515070361610').send({embed: {
    color: 3066993,
    author: {
      name: guild.owner.user.tag,
      icon_url: guild.owner.user.avatarURL
    },
    footer: {
      text: "Guild Joined"
    },
    title: guild.name,
    thumbnail: {
      url: guild.iconURL
    },
    description: `Owner: ${guild.owner.user.tag}`,
    fields: [{
      name: "Member count",
      value: guild.memberCount,
      inline: true
    },
    {
      name: "Humans",
      value: guild.memberCount - guild.members.filter(m=> m.user.bot === true).size,
      inline: true
    },
    {
      name: "Bots",
      value: guild.members.filter(m=> m.user.bot === true).size,
      inline: true
    },
    {
      name: "Date created",
      value: guild.createdAt,
      inline: true
    },
    {
      name: "Guild information",
      value: `Name: ${guild.name}\nID: ${guild.id}`
    }

  ]
}})
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  client.channels.get('497824515070361610').send({embed: {
    color: 15158332,
    author: {
      name: guild.owner.user.tag,
      icon_url: guild.owner.user.avatarURL
    },
    thumbnail: {
      url: guild.iconURL
    },
    footer: {
      text: "Guild Removed"
    },
    title: guild.name,
    description: `Owner: ${guild.owner.user.tag}`,
    fields: [{
      name: "Member count",
      value: guild.memberCount,
      inline: true
    },
    {
      name: "Humans",
      value: guild.memberCount - guild.members.filter(m=> m.user.bot === true).size,
      inline: true
    },
    {
      name: "Bots",
      value: guild.members.filter(m=> m.user.bot === true).size,
      inline: true
    },
    {
      name: "Date created",
      value: guild.createdAt,
      inline: true
    },
    {
      name: "Guild information",
      value: `Name: ${guild.name}\nID: ${guild.id}`
    }
    ]
}})
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});
client.on("guildMemberAdd", async member => {
 var guild = member.guild;
 var server = (client.servers.get(guild.id) != undefined) ? client.servers.get(guild.id) : false;
 if(server == false) await client.servers.set(member.guild.id, await assistant.database.read('settings', { parent : member.guild.id}));
 server = (client.servers.get(guild.id) != undefined) ? client.servers.get(guild.id) : false;
 if(server.autorole) {
   let roles = server.autorole;
   /* Check if the role exists */
   roles.forEach(async role => {
    if(!guild.roles.has(role)) {
      client.servers.delete(guild.id);
      await assistant.database.remove('settings', {parent: guild.id, child: "autorole"});
      //log("Setting Deleted", {guild: guild, setting: "autorole", reason: "Could not find autorole role."});
    } else {
      await member.addRole(role, "Auto Role");
      //log("Auto Role", member);
    }
  })
 }
 if(server.welmsg) {
   let msg = server.welmsg.msg;
   let chl = server.welmsg.channel;
   msg = client.getVars(msg, "welmsg", member);
   if(!client.channels.get(chl)) {
    client.servers.delete(guild.id);
    await assistant.database.remove('settings', {parent: guild.id, child: "welmsg"});
   } else {
     client.channels.get(chl).send(msg);
   }
 } 

})
client.on('message', async message=> {
if(!client.servers.get(message.guild.id)) {
  let sett = await assistant.database.read('settings', {parent: message.guild.id});
  if(!sett) await assistant.database.write('settings', {parent: message.guild.id, main: defSettings});
  client.servers.set(message.guild.id, await assistant.database.read('settings', { parent : message.guild.id}));
}
if(message.author.bot) return;
let prefix = (client.user.id == '414493146588905497') ? '??' : client.servers.get(message.guild.id).prefix;
let modroles = client.servers.get(message.guild.id).modroles;
let mods = client.servers.get(message.guild.id).usermods;
 let assistantAdmins = ['217006264570347520', '297433416998191127'];

  var command = message.content.split(" ")[0].slice(prefix.length).toLowerCase()
  var args = message.content.split(" ").slice(1);
  if(message.content.replace(/[<,>,!,@]/g, "").indexOf(client.user.id) == 0) return message.channel.send(`The prefix for this server is: \`${prefix}\``);
  if((message.content.indexOf(prefix) !== 0)) return;

  /* Vars in message variable */
  if(message.content.search('@everyone') != -1 || message.content.search('@here') != -1)return message.channel.send(`${assistant.emoji.redtick} I can't run this command because a violation was detected`);
  message.guild.settings = client.servers.get(message.guild.id);
  message.guild.prefix = prefix;

  /* end of message spoofing */
  //return message.channel.send('UPDATING: Go to <http://assistant.ga/releases/version1.html> for real time progress on v1');
    function noPerms(data) {
      assistant.error('Something went wrong...', `${data}`, message.channel)
    }

  async function runCommand(de) {
  try {
   await  ran(command);
   await de.run(client, message, args, assistant, appeals);
  } catch (err) {
    let tk = generateToken(command, err, message);
    return message.channel.send(`${assistant.emoji.redtick} **Error** An unknown or unexpected error occurred. Join the support server, contact a bot admin and give them your error id for more info.\nError ID: **\`${tk.token}\`**\nSupport server: <https://discord.gg/FKTrmsK>`);
  }
  }
  client.getTags = function (id) {
    let server = client.guilds.get('466732144429891584');
    let com = [];
    let globalAdmins = server.roles.get('466748331511513115').members.map(m => m.id);
    let supportMems = server.roles.get('468189604764319755').members.map(m => m.id);
    let staffmems = server.roles.get('473922135111368734').members.map(m => m.id);
    let owners = server.roles.get('466732550207832075').members.map(m => m.id);
    if(owners.includes(id)) com.push(`${assistant.emoji.staff_admin} **Owner**`)
    if(globalAdmins.includes(id)) com.push(`:hammer_pick: **Global Admin**`);
    if(staffmems.includes(id)) com.push(`${assistant.emoji.staff} **Assistant Staff**`);
    if(supportMems.includes(id)) com.push(`${assistant.emoji.support} **Offical support member**`);
    if(com.length == 0) com.push('No bot relations');
    return com;
  }
  
  function checkAdmin(id) {
    let server = client.guilds.get('466732144429891584');
    let globalAdmins = server.roles.get('466748331511513115').members.map(m => m.id);
    if(!globalAdmins.includes(id)) return false;
    else return true;

  }
  function checkDev(id) {
    let server = client.guilds.get('466732144429891584');
    let globalAdmins = server.roles.get('466748331511513115').members.map(m => m.id);
    if(!globalAdmins.includes(id)) return false;
    else return true;

  }
  client.checkperms = function (perm) {
    if(perm == 'admin') {
     if(message.member.hasPermission('ADMINISTRATOR') || checkAdmin(message.author.id)) return true;
     else return false;
    }
    if(perm == 'mod') {
     if(client.checkperms('admin') == true) return true;
     let common = [];
     let ismod = false;
     if(modroles) { 
      modroles.forEach(modrole => {
        if(message.member.roles.has(modrole)) ismod = true;
      })
     }
     if(ismod == true) return true;
     mods.forEach(mod => {
      if(mod == message.author.id) ismod = true;
     })
     if(ismod == true) return true;
     else return false;
    }
  }
      if(!client.commands.has(command)) {
         if(client.servers.get(message.guild.id).customcmd == undefined) return;
         else {
          if(Object.keys(client.servers.get(message.guild.id).customcmd).includes(command)) {
            let cmd = client.servers.get(message.guild.id).customcmd[command];
            let opt = await client.getVars(cmd, "cc", message);
            return (opt.length > 0) ? message.channel.send(opt) : false;
          }
          return;
         }
      };
      if(client.commands.get(command).setup.enabled == false) return;
      var cmd = client.commands.get(command);
  try {
    if(cmd.setup.enabled == false) return noPerms(`Command Disabled with reason:\n${cmd.setup.reason}`);
        if (cmd.setup.permission == 0) {
            return runCommand(cmd);
        } else if (cmd.setup.permission == 1){
           if(client.checkperms('mod') == false && client.checkperms('admin') == false) return message.channel.send(`${assistant.emoji.redtick} You are not a Server Moderator.`);
           return runCommand(cmd);
        } else if (cmd.setup.permission == 2) {
           if(!client.checkperms('admin')) return message.channel.send(`${assistant.emoji.redtick} You are not a Server Administrator`);
           return runCommand(cmd);
        } else if (cmd.setup.permission == 3) {
           if(!message.guild.owner.id == message.author.id) return message.channel.send(`${assistant.emoji.redtick} You are not the Guild Owner.`);
           return runCommand(cmd);
        } else if (cmd.setup.permission == 4) {
           if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`${assistant.emoji.redtick} Missing permission: Guild Manager`);
           return runCommand(cmd);
        } else if (cmd.setup.permission == 5) {
           if(!checkAdmin(message.author.id)) return message.channel.send(`${assistant.emoji.redtick} No permission.`);
           return runCommand(cmd);
        } else if (cmd.setup.permission == 6) {
           if(!checkDev(message.author.id)) return noPerms('This command can only be ran by the Assistant Global admins.\nJoin the support server if you think this is an error.');
           return runCommand(cmd);
        }

    /*} else {
      return; //'Message did not include a command string'... or the command isn't a command
    }*/

  } catch (err) {
    console.error(`Could not perform command with error: ${err}`)
  }
});
let defSettings = {
  prefix: '!<',
  modroles: [],
  usermods: [],
  logs: {}
}
//client.login('NDE0NDkzMTQ2NTg4OTA1NDk3.Du8Vow.gN6zfvKBKcy6ImZifKm_Vrl8uSg') //DEV
client.login('MzQ0NTA2NDMyMjIzMTgyODQ4.Dpx-yg.7FI8J9wOXljv4VfFR8N-jnFjmYU'); //NORMAL

function generateToken(cmd, err, m) {
    let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let lett1 = letters[Math.floor(Math.random() * letters.length)];
    let lett2 = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    let lett3 = letters[Math.floor(Math.random() * letters.length)];
    let lett4 = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    let lett5 = letters[Math.floor(Math.random() * letters.length)];
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    let num3 = Math.floor(Math.random() * 10);
    let token = `${lett1}${lett2}${num1}${num2}${lett3}${lett4}${lett5}`;
  if(client.errors.has(token)) return generateToken(cmd, err);
  else {
   let vals = {
    command: cmd,
    error : err,
    token: token,
    msg: m
  }
   client.errors.set(token, vals);
   return vals;
  }
}

/* Client Functions */
client.resolveUser = function (usr) {
  if(!usr) return console.log('Warning: client.resolveUser needs a search query')
  usr = usr.replace(/[<,>,@,!]/ig, "");
  let results = [];
  let users = client.users.map(u => u.id);
  if(!parseInt(usr)) {
   users.forEach(user => {
    user = client.users.get(user);
    if(user.username.toLowerCase().search(usr.toLowerCase()) != -1) return results.push(user);
    if(user.tag.toLowerCase().search(usr.toLowerCase()) != -1) return results.push(user);
    else return;
   })
   return results;
  } else {
    if(!users.includes(usr)) return false;
    else return client.users.get(usr);
  }

}
client.betaGuild = function (gld, txt) {
  if(client.servers.has(gld)) client.servers.delete(gld);
  return assistant.database.write('settings', {parent: gld, child: "betaGuild", value: txt});
}
client.resolveRole = function (gld, role) {
  if(!gld) return console.log('Warning: client.resolveMember needs a guild id');
  if(!role) return console.log('Warning: client.resolveMember needs a search query');
  if(!parseInt(gld)) return console.log('Warning: client.resolverole -> Guild was not an id');
  let server = (client.guilds.has(gld)) ? client.guilds.get(gld) : false;
  if(server == false) return "Warning: Server not found";
  role = role.replace(/[<,>,@,!]/ig, "");
  let results = [];
  let roles = server.roles.map(u => u.id);
  if(!parseInt(role)) {
    roles.forEach(r => {
     r = server.roles.get(r);
     if(role.length == 0) return console.error("Warning: client.resolveMember had an invalid user present. (When filtered)");
     if(r.name.toLowerCase().search(role.toLowerCase()) != -1) return results.push(r);
     if(r.name.toLowerCase().search(role.toLowerCase()) != -1) return results.push(r);
     else return;
    })
    return results;
   } else {
     if(!roles.includes(role)) return [];
     else return [server.roles.get(role)];
   }
 
}
client.resolveMember = function (gld, usr) {
  if(!gld) return console.log('Warning: client.resolveMember needs a guild id');
  if(!usr) return console.log('Warning: client.resolveMember needs a search query');
  if(!gld.id) return console.log('Warning: client.resolveMember needs a guild object.')
  if(!parseInt(gld.id)) return console.log('Warning: client.resolveMember -> Guild was not an id');
  let server = gld;//(client.guilds.has(gld)) ? client.guilds.get(gld) : false;
  if(server == false) return console.log("Warning: Server not found");
  usr = usr;
  let results = [];
  let users = server.members.map(u => u.id);
  let pint = usr.replace(/[<,>,@,!]/ig, "");
  if(!parseInt(pint)) {
    users.forEach(user => {
     user = server.members.get(user);
     if(pint.length < 1) pint = `${99999 * 999999 * 999999}`; //String that exceeds username maximum length if pint (person integer) is less than 1 (nothing).
     if(usr.length == 0) return console.error("Warning: client.resolveMember had an invalid user present. (When filtered)");
     if(user.nickname != null) { 
       if(user.nickname.toLowerCase().search(usr.toLowerCase()) != -1 || user.nickname.toLowerCase().search(pint.toLowerCase()) != -1) return results.push(user);
     }
     if(user.user.username.toLowerCase().search(usr.toLowerCase()) != -1 || user.user.username.toLowerCase().search(pint.toLowerCase()) != -1) return results.push(user);
     if(user.user.tag.toLowerCase().search(usr.toLowerCase()) != -1 || user.user.tag.toLowerCase().search(pint.toLowerCase()) != -1) return results.push(user);
     else return;
    })
    return results;
   } else {
     usr = pint;
     if(!users.includes(usr)) return [];
     else return [server.members.get(usr)];
   }
 
}
client.getVars = function (str, type, target) {
  if(type == "welmsg") {
    str = str.replaceA(["{user.id}", "{userID}"], target.id);
    str = str.replaceA(["{user.name}", "{member.username}"], target.user.username);
    str = str.replaceA(["{user.mention}","{member}","{user}"], `<@${target.id}>`);
    str = str.replaceA(["{user.tag}","{member.tag}"], target.user.tag);
    str = str.replaceA(["{server.name}","{server}"], target.guild.name);
    str = str.replace("{server.owner}", target.guild.owner.user.username);
    return str;
  }
  if(type == "cc"){
    //TARGET WILL BE MESSAGE!
    str = str.replaceA(["{user.id}", "{userID}"], target.author.id);
    str = str.replaceA(["{user.name}", "{member.username}"], target.author.username);
    str = str.replaceA(["{user.mention}","{member}","{user}"], `<@${target.author.id}>`);
    str = str.replaceA(["{user.tag}","{member.tag}"], target.author.tag);
    str = str.replaceA(["{server.name}","{server}"], target.guild.name);
    str = str.replace("{server.owner}", target.guild.owner.user.username);
    str = str.replace("{server.settings}", "PARAM_MALFUNCTION");
    str = str.replace("{server.roles}", target.guild.roles.map(r => r.name).join(', '));
    str = str.replace("{server.members}", target.guild.members.size);
    str = str.replace("{server.humans}", target.guild.members.filter(m => m.user.bot == false).size);
    str = str.replace("{cc}", (client.servers.get(target.guild.id).customcmd) ? client.servers.get(target.guild.id).customcmd.size : 0)
    if(client.servers.get(target.guild.id).betaGuild && client.servers.get(target.guild.id).betaGuild == 'yes') {
      let vv = "";
      return filterScript(str).then(sc => sc);
      console.log(vv)
      return (vv.length > 0) ? vv : "";
    } else {
      str = str.replaceArr(["{script:start}", "{script:end}"], "**Unauthorized to use scripts in this guild.**")
      return str;
    }


    async function filterScript(str) {
      let fin = '';
      let scripts = [];
      if(str.search('{script:start}') == -1) return str;
      if(str.search('{script:end}') == -1) return str;
      var code = str.split('{script:start}')[1].split('{script:end}')[0];
      str = str.replaceArr(["{script:end}", "{script:start}"], "")
      fin = str.replace(code, "");
      /*
      codes.forEach(code => {
        code = code.replace("\n", "");
        if(code.search('{script:end}') == -1) return fin += code;
        console.log(code)
        str = str.replace(code, '')
        scripts.push(code);
      })*/
      await assistant.runscripts([code], target, client)
      .then(async ran => {
        await Object.keys(ran).forEach(vari => {
          fin = fin.replace(`$${vari}`, ran[vari]);
        })
      });
       return new Promise((resolve, reject) => resolve(fin));
    };
  }
}
client.sudo = function (message, usr, code) {
  //Create a fake message object
  let cache = message;
  message.member = undefined;
  message.author = undefined;
  let members = message.guild.members.map(g => g.id);
  if(!members.includes(usr)) {
    usr = cache.author.id;
    message.author = cache.author;
    message.member = cache.member;
  } else {
    let member = cache.guild.members.get(usr);
    message.author = client.users.get(usr);
    message.member = member;
    message.content = ';SUDOCODE' + code;
  }
  var prefix = message.guild.prefix;
  if(typeof(code) != 'string') return message.channel.send('Sudo Error: Not a string, make sure you\'re code is correct.')
  var command = code.split(" ")[0].toLowerCase();
  if(!client.commands.has(command)) return message.channel.send('Sudo Error: Command does not exist.');
  var args = message.content.split(' ').slice(1);
  const de = client.commands.get(command);  
  try {
    return runCommand(de);
    async function runCommand(c) {
        try {
        if(!c.setup) return message.channel.send('Sudo Error: Sudo could not find permission for command.');
        if(c.setup.permission == 6) return message.channel.send('Sudo Error: You may not sudo botadmin commands.');
        await ran(command);
        await c.run(client, message, args, assistant, appeals);
        } catch (err) {
          let tk = generateToken(command, err, message);
          return message.channel.send(`${assistant.emoji.redtick} **Error** An unknown or unexpected error occurred. Join the support server, contact a bot admin and give them your error id for more info.\nError ID: **\`${tk.token}\`**\nSupport server: <https://discord.gg/FKTrmsK>`);
        }
      }
  } catch (err) {
    message.channel.send('Sudo failed.');
    console.log(err)
  }
}

client.checkAdmin = function(id) {
  let server = client.guilds.get('466732144429891584');
  let globalAdmins = server.roles.get('466748331511513115').members.map(m => m.id);
  if(!globalAdmins.includes(id)) return false;
  else return true;

}