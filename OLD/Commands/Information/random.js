exports.setup = {
'name' : 'random',
'aliases' : [''],
'usage' : 'random 1,2,3 - picks a random number or text\n**Extra:**\n -random I love you, I hate you, I kinda Like you!',
'details' : 'Let Assistant choose a random response from the list!',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}

exports.run = function(client, message) {
const args = message.content.split(' ')
const listarg = args.slice(1, 20000).join(" ").split(',')
const random = Math.floor((Math.random() * listarg.length) + 0);
message.channel.send(`I choose:\n${listarg[random]}`)
}
