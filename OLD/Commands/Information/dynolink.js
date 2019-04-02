exports.setup = {
'name' : 'dynolink',
'aliases' : ['dl'],
'usage' : 'dynolink - Gives you the dyno edit link for your server.',
'details' : 'Self explainitory.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}
exports.run = (client, message, args) => {
message.channel.send(`https://www.dynobot.net/server/${message.guild.id}`)
}
