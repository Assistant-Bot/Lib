exports.setup = {
'name' : 'ping',
'usage' : 'ping',
'info' : 'Check the connection of Assistant to Discord. (Ping also checks speed)',
'permissionTxt' : 'Everyone',
'permission': 0,
'enabled' : true
}

exports.run = async function(client, message) {
    const m = await message.channel.send("Pinging...");
		m.edit(`**Speed (ping):** ${m.createdTimestamp - message.createdTimestamp}ms. **Connection to Discord:** ${Math.round(client.ping)}ms`)
}
