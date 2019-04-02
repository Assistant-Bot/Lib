exports.setup = {
'name' : 'mutuals',
'aliases' : ['mutuals'],
'usage' : 'mutuals',
'details' : 'Shows all the servers you have in common with assistant.\nCredit for this command goes to: advaith (Global Administrator)',
'permission' : 0,
'permissionTxt' : 'Everyone',
'antiTheft': false,
'enabled' : true
}
exports.run = async (client, message, args) => {

  // Bot Permission check
       if(!message.guild.members.get(client.user.id).hasPermission('EMBED_LINKS'))
         return message.channel.send(`**__${client.user.username} Mutual Servers__**\n\n**${client.guilds.filter(guild => guild.members.has(message.author.id)).size} total mutuals**\n\n• ${client.guilds.filter(guild => guild.members.has(message.author.id)).map(guild => guild.name).toString().replace(/,/g, "\n• ")}`)

  message.channel.send({
  "embed": {
    "title": `${client.user.username} Mutual Servers`,
    "color": 50175,
    "description": `**${client.guilds.filter(guild => guild.members.has(message.author.id)).size} total mutuals**\n\n• ${client.guilds.filter(guild => guild.members.has(message.author.id)).map(guild => guild.name).toString().replace(/,/g, "\n• ")}`
  }
})

}
