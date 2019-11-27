class serverinfo {
    constructor() {
        this.name = 'serverinfo';
        this.aliases = ['si', 'sinfo'];
        this.description = 'serverinfo';
        this.longDescription = 'Show information for the queried user';
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {

        if (!msg.guild.members.get(bot.user.id).permission.has('embedLinks')) {
            return Util.sendError(msg, emojis, 'perm', 'Embed Links');
        }
        /* Basic Information */
        const guild = msg.guild;
        let roles = guild.roles.map(r => r);
        let members = guild.members.map(m => m);
        let channels = guild.channels.map(c => c);
        let owner = guild.members.get(guild.ownerID);
        let g_emojis = guild.emojis;
        let isLarge = guild.large;
        let icon = (!guild.iconURL) ? bot.user.avatarURL : guild.iconURL;

        /* Depth Information */
        let verif;
        let nitro = {
            level: guild.premiumTier,
            boosts: guild.premiumSuscriptionCount
        };
        let admins_mfa = (guild.mfaLevel === 0) ? 'No' : 'Yes';
        let afk_timeout = (guild.afkTimeout <= 0) ? 'No' : (guild.afkTimeout / 60) + ' minutes';
        let afkChannel = (guild.afkChannelID === null) ? 'None' : `${guild.channels.get(guild.afkChannelID).name} \`${guild.afkChannelID}\``;
        let createdAt = guild.createdAt;
        let explicitContent = (guild.explicitContentFilter <= 0) ? 'Off' : (guild.explicitContentFilter === 1) ? 'No roles' : 'Everyone';
        let region = Util.resolveRegionEmoji(guild.region);
        let verification = 
            (guild.verificationLevel === 0) ? 'None' : 
            (guild.verificationLevel === 1) ? 'Email only' :
            (guild.verificationLevel === 2) ? '5 minutes':
            (guild.verificationLevel === 3) ? '10 minutes': 'Phone Only';
        let mems = {
            online: members.filter((m) => {return (m.status === 'online')}).length,
            dnd: members.filter((m) => {return (m.status === 'dnd')}).length,
            idle: members.filter((m) => {return (m.status === 'idle')}).length,
            offline: members.filter((m) => {return (m.status === 'offline')}).length
        };
        let emojis_m = Util.cutString(g_emojis.map(e => ((!e.animated) ? '<:' : '<a:') + `${e.name}:${e.id}>`).join(' '), 1023, true);
        let rolesInfos = '';// roles.map(rl => `${rl.name} (\`${rl.id}\`)`).join(', ');
        let em = new Util.SimpleEmbed()
            .setAuthor(guild.name, icon)
            .setThumbnail(icon)
            .addField('Server Name', guild.name, true)
            .addField('Region', `${region.flag} ${region.text}`, true)
            .addField('Created At', new Date(createdAt).toDateString().split(' ').slice(1).join(' '), true)
            .addField('Owner', `${owner.username}#${owner.discriminator}`, true)
            .addField('Owner ID',  `\`${owner.id}\``, true)
            .addField('2fa Required', admins_mfa, true)
            .addField('AFK Channel', afkChannel, true)
            .addField('AFK Time', afk_timeout, true)
            .addField('Verification', verification, true)
            .addField('NSFW Filter', explicitContent, true)
            .addField(`Members [${members.length}]`, `**Online:** ${mems.online}\n**Dnd:** ${mems.dnd}\n**Idle:** ${mems.idle}\n**Offline:** ${mems.offline}`, true)
            .addField(`Channels [${channels.length}]`, `owo`, true)
            .addField(`Emojis [${g_emojis.length}]`, emojis_m, false)
            .addField(`Roles [${roles.length}]`, rolesInfos, false)
            .setColor('#26d1ff');
        msg.channel.send(em);
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = serverinfo;