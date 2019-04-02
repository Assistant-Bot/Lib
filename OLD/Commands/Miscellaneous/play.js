exports.setup = {
    'name' : 'play',
    'aliases' : ['p'],
    'usage' : 'play <song>',
    'details' : 'Play music',
    'permission' : 0,
    'permissionTxt' : 'Everyone',
    'antiTheft': false,
    'enabled' : true
}
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const Util = require('discord.js');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube('AIzaSyCfigISsztv6j2wYj4BBhNjj7eXwUYEwBs')
exports.run = async (client, message, args, assistant) => {
 if(client.servers.get(message.guild.id).betaGuild !== 'yes') return message.channel.send(`${assistant.emoji.redtick} This feature has been disabled for public servers until the next update due to abuse.`);
 if(!message.member.voiceChannel) return message.channel.send(`${assistant.emoji.redtick} You need to be in a voice channel to use this feature.`);
 //check if queue exists 
 if(!args[0]) return message.channel.send('Send a video link, playlist, or video name');
 let url = args.slice(0, args.length).join(' ');
 const permissions = message.member.voiceChannel.permissionsFor(message.client.user); 
 if(!permissions.has('CONNECT')) return message.channel.send(`${assistant.emoji.redtick} I need permissions to join this channel.`);
 if(!permissions.has('SPEAK')) return message.channel.send(`${assistant.emoji.redtick} I need permissions to speak in this channel.`);
 let server = client.servers.get(message.guild.id);
 const obj = {
    queued: [],
    played: [],
    playing: false,
    connected: false,
    conection: null,
    settings: {
        volume: 3,
        djonly: false,
        loop: false,
        autoplay: false
    },
    channels: {
        message: message,
        voiceChannel: null
    },
    skip: function (amount) {
        if(this.connection == null) return;
        if(amount) {
            this.queued.splice(1, parseInt(amount));
            let songTo = this.queued[0];
            this.connection.dispatcher.end();
            return songTo.title;
        } else {
            let songTo = this.queued[1];
            this.connection.dispatcher.end();
            return songTo.title;
        }
    },
    stop: function () {
        this.queued = [];
        this.connection.dispatcher.end();
    },
    pause: function () {
        this.playing = false;
        this.connection.dispatcher.pause();
    },
    resume: function () {
        this.playing = true;
        this.connection.dispatcher.resume();
    },
    handleVideo: async function (video, message) {
        const song = {
            id: video.id,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            title: Util.escapeMarkdown(video.title),
            description: (video.description.length < 100) ? video.description : `${video.description} ...`,
            uploaded: video.publishedAt,
            channel: video.channel,
            time: {
                hours: video.duration.hours,
                minutes: video.duration.minutes,
                seconds: video.duration.seconds
            }
        };
        let msg = message;
        let vc = this.channels.voiceChannel;
        if(vc == null) {
        this.queued.push(song);
        try {
            let voiceChan = message.member.voiceChannel;
            let connection = await voiceChan.join()
            connection.on('disconnect', () => {
                this.play(message.guild)
            });
            this.channels.voiceChannel = voiceChan;
            this.connection = connection;
            this.play(msg, this.queued[0]);
            this.channels.message.channel.send(`Now playing: **${song.title}**`);
        } catch (error) {
            console.log(error)
            this.channels.message.channel.send(`${assistant.emoji.redtick} Something went wrong when I tried connecting, this could be an issue with the song, or my permissions to join a channel.`);
            client.queues.delete(message.guild.id);
        }
        } else {
            /*this.queued.push(song);
            let em = new Discord.RichEmbed();
            em.setColor('#40a4e1');
            em.setAuthor(`Song added to Queue [${this.queued.length}]`, 'https://cdn.discordapp.com/attachments/424722925074120705/517978579905019907/equalizer.gif');
            em.setTimestamp(song.publishedAt);
            //em.setThumbnail(song.thumbnail.url);
            em.setFooter('Uploaded')
            em.addField(`Information`, `**User:** ${message.author.tag}\n**Name:** ${song.title}\n**Link:** [Click here](${song.url})\n**Queue Place:** ${this.queued.length}\n**Estimated Time:** Coming Soon`, true);
            em.addField(`Video Information`, `**Name:** ${song.title}\n**Link:** [Click here](${song.url})\n**Uploader:** [${song.channel.title}](https://www.youtube.com/channel/${song.channel.id})\n**Duration:** **${song.time.hours}** hours, **${song.time.minutes}** minutes and **${song.time.seconds}** seconds.`, true);
            em.addField(`Video Description`, song.description, true)
            this.channels.message.channel.send(em)*/
            this.queued.push(song);
            this.channels.message.channel.send(`**${message.author.username}** queued: ${song.title}. [${this.queued.length}]`)
        }
    },
    play: async function (msg, song) {
        if(!song || song == undefined) {
            if(this.settings.loop == true) {
                await this.played.forEach(sg => {
                    this.queued.push(sg);
                    this.played.splice(this.played.indexOf(sg))
                });
                song = this.queued[0];
                this.channels.message.channel.send(`The queue finished, and loop was enabled!`);
            } else {
                this.channels.voiceChannel.leave();
                this.channels.message.channel.send(`The queue has finished!`);
                return client.queues.delete(msg.guild.id);
            }
        }
        const dispatcher = this.connection.playStream(ytdl(song.url))
        .on('end', () => {
            let prev = this.queued.shift();
            this.played.push(prev);
            dispatcher.setVolumeLogarithmic(this.settings.volume / 5);
            this.play(msg, this.queued[0]);
        })
        .on('error', error => { 
            console.log(error)
            message.channel.send(`${assistant.emoji.redtick} Something went wrong when trying to play, try joining the support server if the problem proceeds.`)});
        this.playing = true;
        }
}
if(!client.queues.has(message.guild.id)) client.queues.set(message.guild.id, obj);
    try {
        var videos = await youtube.searchVideos(url, 1);
        var video = await youtube.getVideoByID(videos[0].id)
    } catch (err) {
        try {
            var videos = await youtube.searchVideos(url, 1);
            var video = await youtube.getVideoByID(videos[0].id)
        } catch (err) {
            console.log(err)
            return message.channel.send(`${assistant.emoji.redtick} I could not find that video`);
        }
    }
    return client.queues.get(message.guild.id).handleVideo(video, message);
}