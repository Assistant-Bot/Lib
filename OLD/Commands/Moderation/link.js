exports.setup = {
    'name' : 'link',
    'aliases' : ['l'],
    'usage' : `link guildID/invite`,
    'details' : 'Show all bot admins, and show if they are online!',
    'permission' : 1,
    'permissionTxt' : 'Server Moderator',
    'antiTheft': false,
    'enabled' : true
}
exports.run = async (client, message, args, assistant) => {
    
}

exports.run = async function(client, message, args, assistant) {
    /* Readable Uptime format */
       let temp = process.uptime();
        var days = Math.floor((temp %= 31536000) / 86400);
        var hours = Math.floor((temp %= 86400) / 3600);
        var minutes = Math.floor((temp %= 3600) / 60);
        var seconds = temp % 60;
    /* end of uptime stuff */
    const Discord = require('discord.js')
    message.channel.send(new Discord.RichEmbed()
        .setAuthor(`${client.user.username}`, `${client.user.avatarURL}`)
        .setColor(message.member.displayHexColor)
        .addField("Developers", `${client.users.get('217006264570347520').tag}\n${client.users.get('212026264742002688').tag}`, true)
        .addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField("Uptime", `${days} Days, ${hours} hours\n${minutes} minutes, ${Math.round(seconds)} seconds.`, true)
        .addField("Node.js Version", `${process.version}`, true)
        .addField("Bot Information", `${client.guilds.size} servers\n${client.users.size} users.`, true)
        .addField("Guilds Playing music", `**${client.voiceConnections.size}** guilds jamming to music!`, true)
        .addField('Assitant version', `${assistant.version}`)
        .addField("Library", '**Language:** Node.js, Python\n**Library:** `Discord.js, AssistantCC.js, AssistantDebugClient.py`'))
    }