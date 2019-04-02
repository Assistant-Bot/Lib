exports.setup = {
    'name' : 'stop',
    'aliases' : [],
    'usage' : 'stop',
    'details' : 'Stops the music queue',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Util = require('discord.js');
exports.run = async (client, message, args, assistant) => {
    if(!message.member.voiceChannel) return message.channel.send('You are not in a voice channel');
    if(!client.queues.has(message.guild.id)) {
        return message.channel.send(`${assistant.emoji.redtick} There is no music playing.`)
    } else {
        let serv = client.queues.get(message.guild.id);
        let server = client.servers.get(message.guild.id);
        let voiceChannel = message.member.voiceChannel;
        if(voiceChannel.members.size <= 2) {
            if(message.member.voiceChannel.id != serv.channels.voiceChannel.id) return message.channel.send(`${assistant.emoji.redtick} You are not in this channel.`)
            let m = await message.channel.send(`${assistant.emoji.square} Preparing to stop.`)
            serv.stop();
            return m.edit(`${assistant.emoji.check} Successfully disconnected.`)
        }
        if(serv.settings.djonly == false) {
            let m = await message.channel.send(`${assistant.emoji.square} Preparing to stop.`)
            await serv.stop();
            return m.edit(`${assistant.emoji.check} Successfully disconnected.`)
        }
        if(serv.settings.djonly == true) {
            let dj = (!server.djSettings) ? null : server.djSettings;
            let users = (!dj.users) ? null : dj.users;
            let role = (!dj.role) ? null : dj.role;
            if(dj == null) return stop();
            if(users.includes(message.author.id)) return stop();
            if(!message.guild.roles.map(r => r.id).includes(role)) {
                message.channel.send(`${assistant.emoji.warning} **Warning:** The dj role that is saved could not be found. Remove it and add a new one.\nStopping with bypass.`);
                return stop();
            }
            role = message.guild.roles.get(role);
            if(!role.members.map(m => m.id).includes(message.author.id)) return message.channel.send(`${assistant.emoji.redtick} **DJ-Only** enabled, and you are not a DJ`);
            else {
                return stop();
            }
            async function stop() {
                let m = await message.channel.send(`${assistant.emoji.square} Preparing to stop.`)
                serv.stop();
                return m.edit(`${assistant.emoji.check} Successfully disconnected.`)
            }

        }
    } 
}