require('discord.js');
const Discord = require('discord.js')
const db = require('./db.js').database;
exports.version = "Assistant 1.0.5";
exports.embedDefault = {
    color: function () {
      return '#3aecfc';
    },

    make: function(title, desc, fields) {
      let obj = {
       'color' : '#3aecfc',
       'title' : title,
       'description' : desc,
       'fields' : fields,
       'footer' : {
        'text' : 'Assistant Bot',
        'timestamp' : new Date()
       }
      }
      return obj;

    }
},
exports.database = {
  readasync: async function(path) {
    let dum = {};
      await db.collection(path).get().then((snapshot) => {
        snapshot.forEach((doc) => {
          dum[doc.id] = doc.data();
        });
      })
      return dum;
  },
  read: async function(place, data) {
   let doc = db.collection(place).doc(data.parent); //Get the setting
   if(!doc) return false;
   let docx = await doc.get();
   let dr = docx.data();
   if(!docx.data()) return false;
   if(!data.child) {return dr};
   if(!dr[data.child]) return false;
   else return dr[data.child];
  },
  write: async function(place, data, merge) {
  if(!place) return false;
  if(!data) return false;
  if(!data.parent) return false;
  let doc = db.collection(place).doc(data.parent); //Get the setting
  if(!doc) return false;
  let docx = await doc.get();
  let dr = docx.data() || {};
  if(data.main) {
   dr = data.main;
   return doc.set(dr);
  }
  if(!data.child) return false;
  if(!data.value) return false;
  dr[data.child] = data.value;
  return doc.set(dr, {merge: (merge == undefined) ? true : merge});
  /* Set up: {parent: message.guild.id, child:"", value:""} */
  },
  remove: async function(place, data) {
    if(!place) return false;
    if(!data) return false;
    if(!data.parent) return false;
    let doc = db.collection(place).doc(data.parent); //Get the setting
    if(!doc) return `Type: ${place} does not exist in database`;
    let docx = await doc.get();
    let dr = docx.data() || false;
    if(!dr) return false;
    if(!dr[data.child]) return doc.delete();
    delete dr[data.child];
    return doc.set(dr);
  }
}
  exports.error = async function(title, desc, channel, time) {
       let embed = new Discord.RichEmbed()
       .setColor('#ff0000')
       .setTitle(title)
       .setDescription(desc)
       .setTimestamp(new Date());
        if(!time) {
        return channel.send(embed);
        } else {
        return await channel.send(embed).then(m => m.delete(time));
        }
 }

 exports.success = function(string, channel) {
 channel.send('<:check:346685847552393226> ' + string);
 }
exports.emoji = {
  loading: '<a:ttraffic:480424075039342602>',
  ping: '<a:ping:480475934621958155>',
  square: '<a:load_box:480476301103464488>',
  ring: '<a:ring_load:480476507706359809>',
  dj: '<a:dj:482684220892905492>',
  check: '<:check:468888626751602690>',
  redtick: '<:redtick:469038228398276608>',
  coin: '<:currency_ownage:483064541345742869>',
  update: '<a:updating:483092093934370816>',
  staff: '<:support:499040864056770583>',
  support: '<:assistantSupport:390611324612247562>',
  youtube: '<:youtube:484549106212012035>',
  bot: '<:bot:499070459405664267>',
  warning: '<:assistantWarning:390739935562301440>',
  staff_admin: '<:globaladmin:499037776168091648>',
  online: '<:onlinesml:455927483167014943>',
  offline: '<:offlinesml:455927483217346560>',
  idle: '<:idlesml:455927482898710561>',
  dnd: '<:dndsml:455927482323828768>',
  info: '<:info:506285563024900097>',
  musicLoop: '<:musicLoop:517968972315099138>'
 }
 exports.betaguilds = ['466732144429891584', '514964778548985877', '398998849026261003', '179742581544976385'];
 //Assistant, Infinity scrims, Advaithbot, OwnageLounge
 exports.runscripts = async function (scrpts, trgt, ASSISTANTDEBUGCLIENT) {
  let localvarASSISTANT = {};
  var args = trgt.content.split(" ").slice(1);
  let sudo = function (id, cmd) {
    return ASSISTANTDEBUGCLIENT.sudo(trgt, id, cmd)
  }
  function silent (bool) {
    return bool;
  }
  const assistant = {
    emoji : require('./functions.js').emoji
  }

  /*CLASSES*/
  function ServerTemp(guild) {
      return {
        members : new MemberMap(trgt.guild.members),
        channels : new ChannelMap(trgt.guild.channels)
      }
    }
  class UserTemp {
    constructor(usr) {
      this.name = usr.user.username;
      this.id = usr.user.id;
      this.joined = usr.joinedAt;
      this.isMute = usr.serverMute;
      this.isDeaf = usr.serverDeaf;
      this.nickname = usr.nickname;
      this.roles = usr.roles;
    }
    setNick(newNick) {
      if(!newNick) return new Error("New nickname required.");
      if(newNick.length > 32) return new Error("New nickname must be less than 32 characters.");
      return trgt.guild.members.get(this.id).setNick(newNick);
    }
    removeRole(roleObj) {
      if(!roleObj) return new Error('Role not found.');
      if(!roleObj.id) return new Error('Invalid Role');
      if(!this.server.roles.has(roleObj.id)) return new Error("Invalid Role");
      return trgt.guild.members.get(this.id).removeRole(roleObj.id);
    }
    addRole(roleObj) {
      if(!roleObj) return new Error('Role not found.');
      if(!roleObj.id) return new Error('Invalid Role');
      if(!this.server.roles.has(roleObj.id)) return new Error("Invalid Role");
      return trgt.guild.members.get(this.id).addRole(roleObj.id);
    }
  }
  class ChannelMap {
    constructor(channels) {
      this.channels = channels;
    let c = new Map();
    channels = channels.map(ch => ch);
    channels.forEach(ch => {
      c.set(ch.id, {
        name: ch.name,
        id: ch.id,
        type: ch.type,
        send:  function (content) {
          if(!content) return new Error("Could not find content to send.");
          return trgt.channels.get(this.id).send(content);
        }
      })
    });
    return c; 
   } 
  }
  class Channel {
    constructor(channel) {
      this.name = channel.name;
      this.id = channel.id;
      this.type = channel.type;
    }
    send(content) {
      if(!content) return new Error("Could not find content to send.");
      return trgt.channels.get(this.id).send(content);
    }
  }
  class MemberMap {
    constructor(members) {
      let m = new Map();
      members = members.map(mi => mi);
      members.forEach(mem => {
        m.set(mem.id, new UserTemp(mem))
      });
      return m;
    }
  }
  function findRole(name) {
    return ASSISTANTDEBUGCLIENT.resolveRole(trgt.guild.id, name);
  }
  function findUser(name) {
    return ASSISTANTDEBUGCLIENT.resolveMember(trgt.guild, name);
  }
  function isMod() {
    let me = trgt;
    if(me.author.permission.includes(2) || me.author.permission.includes(3) || me.author.permission.includes(4)) return true;
    let modroles = (!trgt.guild.settings.modroles) ? undefined : trgt.guild.settings.modroles;
    let isMod = false;
    if(!modroles) return false;
    modroles.forEach(role => {
      if(isMod == true) return;
      let roles = me.member.roles.map(r => r.id);
      if(roles.includes(role)) return isMod = true;
      else return;
    });
    return isMod;
  }
  //CODE
  trgt.author.permission = [0];
  if(trgt.member.hasPermission("ADMINISTRATOR") == true) trgt.author.permission.push(2);
  if(trgt.member.hasPermission("MANAGE_GUILD") == true) trgt.author.permission.push(3);
  if(trgt.member.id == trgt.guild.owner.user.id) trgt.author.permission.push(4);
  if(isMod() == true) trgt.author.permission.push(1);
  let msg = trgt;
  let user = trgt.member;
  let server = trgt.guild;
  await scrpts.forEach(script => {
    if(script.toLowerCase().search('client') != -1 || script.toLowerCase().search('assistantdebugclient') != -1) return trgt.channel.send(`An error occurred with one of the scripts\n**Error:** You can't access bot variables.`);
    //if(script.toLowerCase().search('for\\(') != -1) return trgt.channel.send('An error occured with one of the scripts.\n**Error:** For loops not allowed, use `assistant.for()` instead.')
    script = script.replace(new RegExp("trgt", 'g'), "");
    script = script.replace(new RegExp("{script:end}", 'g'), "");
    script = script.replace(new RegExp('assistant.vars', 'g'), 'localvarASSISTANT');
    script = script.replace(new RegExp('assistant.local', 'g'), 'localvarASSISTANT');
    script = script.replace('permission(0)', "if(msg.author.permission.includes(0));");
    script = script.replace('permission(1)', "if(!msg.author.permission.includes(1)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Moderator.`);");
    script = script.replace('permission(2)', "if(!msg.author.permission.includes(2)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Administrator.`);");
    script = script.replace('permission(3)', "if(!msg.author.permission.includes(3)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Manager.`);");
    script = script.replace('permission(4)', "if(!msg.author.permission.includes(4)) return msg.channel.send(`${assistant.emoji.redtick} You are not the Server Owner.`);");
    script = script.replace('permission(0);', "if(msg.author.permission.includes(0));");
    script = script.replace('permission(1);', "if(!msg.author.permission.includes(1)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Moderator.`);");
    script = script.replace('permission(2);', "if(!msg.author.permission.includes(2)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Administrator.`);");
    script = script.replace('permission(3);', "if(!msg.author.permission.includes(3)) return msg.channel.send(`${assistant.emoji.redtick} You are not a Server Manager.`);");
    script = script.replace('permission(4);', "if(!msg.author.permission.includes(4)) return msg.channel.send(`${assistant.emoji.redtick} You are not the Server Owner.`);");
    //script = script.replace(new RegExp('msg.channel.send', 'g'), "await msg.channel.send");
    //scrpts[scrpts.indexOf(script)] = script.replace('assistant.vars', 'lclDEBUGvarONIT');
    try {
      eval(`async function abcchd() {try {  ${script} } catch (err) { trgt.channel.send(\`An error occurred with one of the scripts, try checking syntax.\\n**Error:** \${err}\`); }} abcchd();`);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return trgt.channel.send(`An error occurred with one of the scripts, try checking syntax.\n**Error:** ${e}`);
      } else {
        return trgt.channel.send(`An error occurred with one of the scripts, try checking syntax.\n**Error:** ${clean(e)}`);
      }
    }
  });
    return new Promise((resolve, reject) => {
      resolve(localvarASSISTANT);
    })
  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
    }
};
exports.getTime = function getTime (now, expire) {
  var expires = new Date(expire);
  now = new Date(now);
  var diffMs = (expires - now); // milliseconds between now & expired time
  var diffDays = Math.floor(diffMs / 86400000); // days
  var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return {
      hours: diffHrs,
      minutes: diffMins,
      days: diffDays
    }
  }
  exports.genID = function () {
    let letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let lett1 = letters[Math.floor(Math.random() * letters.length)];
    let lett2 = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    let lett3 = letters[Math.floor(Math.random() * letters.length)];
    let lett4 = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
    let lett5 = letters[Math.floor(Math.random() * letters.length)];
    let lett6 = letters[Math.floor(Math.random() * letters.length)];
    let lett7 = letters[Math.floor(Math.random() * letters.length)];
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    let num3 = Math.floor(Math.random() * 10);
    let num4 = Math.floor(Math.random() * 10);
    let num5 = Math.floor(Math.random() * 10);
    let token = `${lett1}${lett2}${num1}${lett3}${num2}${lett4}${lett5}${num3}${num4}${lett6}${lett7}${num5}`;
    return token;
}
//npm i  @google-cloud/translate @joegesualdo/youtube-video-info-node advanced-string discord.js express ffmpeg firebase-admin get-youtube-id git google-url googleapis moment moment-duration-format nodemailer opusscript scalc youtube-info ytdl-core