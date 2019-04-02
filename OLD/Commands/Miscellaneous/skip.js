exports.setup = {
    'name' : 'skip',
    'aliases' : ['s'],
    'usage' : 'skip <amount>',
    'details' : 'Play music',
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
        let amount = (!args[0] || !parseInt(args[0])) ? null : parseInt(args[0]);
        let serv = client.queues.get(message.guild.id);
        let server = client.servers.get(message.guild.id);
        let voiceChannel = message.member.voiceChannel;
        if(serv.queued.length <= 1) return message.channel.send(`${assistant.emoji.redtick} Nothing to skip, use \`${message.guild.prefix}stop\`.`);
        if(amount != null) {
            if(serv.queued.length <= amount) return message.channel.send(`${assistant.emoji.redtick} There are only **${serv.queued.length}** songs queued.`);
        }
        if(voiceChannel.members.size == 2) {
            if(message.member.voiceChannel.id != serv.channels.voiceChannel.id) return message.channel.send(`${assistant.emoji.redtick} You are not in this channel.`)
            let m = await message.channel.send(`${assistant.emoji.square} Preparing to skip.`)
            let sk;
            if(amount == null) sk = await serv.skip();
            else sk = await serv.skip(amount);
            return m.edit(`${assistant.emoji.check} Successfully skipped to **${sk}**.`)
        }
        if(serv.settings.djonly == false) {
            let m = await message.channel.send(`${assistant.emoji.square} Preparing to skip.`)
            let sk;
            if(amount == null) sk = await serv.skip();
            else sk = await serv.skip(amount);
            return m.edit(`${assistant.emoji.check} Successfully skipped to **${sk}**.`)
        }
        if(serv.settings.djonly == true) {
            let dj = (!server.djSettings) ? null : server.djSettings;
            let users = (!dj.users) ? null : dj.users;
            let role = (!dj.role) ? null : dj.role;
            if(dj == null) return skip();
            if(users.includes(message.author.id)) return skip();
            if(!message.guild.roles.map(r => r.id).includes(role)) {
                message.channel.send(`${assistant.emoji.warning} **Warning:** The dj role that is saved could not be found. Remove it and add a new one.\nSkipping with bypass.`);
                skip();
            }
            role = message.guild.roles.get(role);
            if(!role.members.map(m => m.id).includes(message.author.id)) return message.channel.send(`${assistant.emoji.redtick} **DJ-Only** mode enabled, and you are not a DJ.`);
            else {
                skip();
            }
            async function skip() {
                let m = await message.channel.send(`${assistant.emoji.square} Preparing to skip.`)
                let sk;
                if(amount == null) sk = await serv.skip();
                else sk = await serv.skip(amount);
                return m.edit(`${assistant.emoji.check} Successfully skipped to **${sk}**.`)
            }

        }
    } 
}