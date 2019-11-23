class Invite {
    constructor() {
        this.name = 'invite';
        this.description = '/invite';
        this.aliases = ['inv', 'i'];
        this.longDescription = 'Invite.';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        const link = 'https://discordapp.com/oauth2/authorize?client_id=' + bot.user.id + '&scope=bot&permissions=8';
        const link2 = 'https://discordapp.com/oauth2/authorize?client_id=' + bot.user.id + '&scope=bot&permissions=2133912823';
        const main = 'https://discordapp.com/oauth2/authorize?client_id=344506432223182848&scope=bot&permissions=2133912831';
        let embed = new Util.SimpleEmbed();
        embed.setAuthor(bot.user.tag, bot.user.avatarURL);
        embed.setColor('#' + Util.getColor('assistant').split('0x')[1]);
        embed.addField('Recommended Invite', '[Admin Permissions](' + link + ')', true);
        embed.addField('Alternative Invite', '[Working Permissions]('+ link2 + ')', true);
        // embed.addField('Main Bot Invite', '[All Permissions](' + main + ')', true);
        return msg.channel.send(embed);
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        Util.logError(bot, msg, args, Util, emojis, this);
        return Util.sendError(msg, emojis, 'unknown');
    }
}

module.exports = Invite;