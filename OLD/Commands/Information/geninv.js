exports.setup = {
'name' : 'geninv',
'aliases' : ['gi', 'geninv'],
'usage' : '',
'details' : '',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
try {
let mention = message.mentions.members.first();
if(!mention.user.bot) return assistant.error('Error', 'Must be a bot', message.channel);
message.channel.send(`https://discordapp.com/api/oauth2/authorize?client_id=${mention.id}&permissions=53509363&scope=bot`)
} catch (err) {
assistant.error('Uh oh', 'An error occurred', message.channel.send)
}
}
