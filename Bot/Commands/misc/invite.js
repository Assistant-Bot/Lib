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
        const link = 'https://discordapp.com/oauth2/authorize?client_id=414493146588905497&scope=bot&permissions=8';
        const link2 = 'https://discordapp.com/oauth2/authorize?client_id=414493146588905497&scope=bot&permissions=2133912823';
        const main = 'https://discordapp.com/oauth2/authorize?client_id=344506432223182848&scope=bot&permissions=2133912831';
        let embed = new Util.SimpleEmbed();
        embed.setAuthor(bot.user.tag, bot.user.displayAvatarURL);
        embed.setColor('#' + Util.getColor('assistant').split('0x')[1]);
        embed.addField('Recommended Invite', '[Admin Permissions](' + link + ')');
        embed.addField('Alternative Invite', '[Working Permissions]('+ link2 + ')');
        embed.addField('Main Bot Invite', '[All Permissions](' + main + ')');
        return msg.channel.send(embed);
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' You require `default` permissions to use this command.');
    }

    async onError(bot, msg, args, Util, emojis) {
        return msg.channel.send(emojis.redtick + ' An error has occurred, join the support server if the problem persists.');
    }
}

module.exports = Invite;