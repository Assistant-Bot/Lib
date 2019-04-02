exports.setup = {
'name' : 'addons',
'aliases' : [''],
'usage' : '??addon download https://assistantbot.com/addons/unofficial/dice.js',
'details' : 'Enable or disable addons for your server.',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : false
}

exports.run = function (client, message){
const Assistant = require('discord.js')
const embed = '#4bf442'
message.channel.send(new Assistant.RichEmbed()
                    .setAuthor(client.user.tag, client.user.avatarURL)
                    .setColor(embed)
                    .addField('Addons', `Currently **0** addons that you can disable and enable.`)
                    .addField('Clyde Addon', 'This addon was designed for mobile users.\n`/getid <username>` - Get the id of a user without mentioning them\n`/getowner` - Gets the owner of the server.')
)
}
