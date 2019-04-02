exports.setup = {
'name' : 'eval',
'aliases' : ['ev', 'e'],
'usage' : 'Nothing shown here.',
'details' : 'Nothing shown here.',
'permission' : 6,
'permissionTxt' : 'Developer',
'antiTheft': false,
'enabled' : true,
'reason' : 'disabled'
}
const banned = [];
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Util = require('discord.js');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube('AIzaSyCfigISsztv6j2wYj4BBhNjj7eXwUYEwBs')
const allowed = ['190916650143318016', '344506432223182848'];
exports.run = async (client, message, args, assistant) => {
if(message.author.id != '217006264570347520' && allowed.includes(message.author.id) == false) return message.channel.send("Eval is for cats, horses and dogs, but you don't look as smart as they do, so I decided to block this request and let you try again :) however, you may request the extra smartness by direct messaging Olybear9!");
function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
      return text;
    }
    if(banned.includes(message.author.id)) return message.channel.send('Auto banned.');
  try {
    const code = args.join(" ");
    //assistant.inspectCode(code, {filter: 'strict', allowExploit: false})
    let evaled = eval(code);
    if(code.search('token') != -1) {
      banned.push(message.author.id)
      return message.channel.send('Hmm, Looks like you banned yourself. **Eval perms revoked**');
    };
    if (typeof evaled !== "string")
      evaled = require("util").inspect(evaled, { depth: 0 });
      if(evaled.search(client.token) != -1) {
        banned.push(message.author.id)
        return message.channel.send('Hmm, Looks like you banned yourself. **Eval perms revoked**');
      }
      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
