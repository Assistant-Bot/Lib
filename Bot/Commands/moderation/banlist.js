class BanList {
    constructor() {
        this.name = 'banlist';
        this.description = '/banlist';
        this.aliases = ['bl'];
        this.longDescription = 'Show the bans for the guild.';
        this.permission = 0,
        this.list = true;
    }

    async onRun(bot, msg, args, Util, emojis) {
        if (!msg.guild.members.get(bot.user.id).permission.has('banMembers')) return Util.sendError(msg, emojis, 'perm', 'Ban Members');
        if (!msg.guild.members.get(bot.user.id).permission.has('embedLinks')) return Util.sendError(msg, emojis, 'perm', 'Embed Links');

        let m = await msg.channel.send(emojis.loading + ' Gathering bans...');
        let bans = await msg.guild.getBans();
        let pretty = [];
        let i = 1;
        let cache = bans.length;
        bans = bans.slice(0, 50);

        await bans.forEach((ban) => {
            pretty.push(`**${i}.)** ` + '__' + ban.user.username + '__ (`' + ban.user.id + ')`');
        }); 

        let em = new Util.SimpleEmbed();
        em.setColor('#fc5928');
        em.setAuthor(msg.guild.name, msg.guild.iconURL);
        em.setTitle('Showing 50 of ' + cache + 'bans');
        em.setDescription(pretty.join('\n'));

        msg.channel.send(em);
    }

    async onNoPerm(bot, msg, args, Util, emojis) {
        return Util.sendError(msg, emojis, 'perm', 'Ban Members')
    }

    async onError(bot, msg, args, Util, emojis, e) {
        return msg.channel.send(emojis.redtick + ' I couldn\'t set the channel cooldown: ' + e.message);
    }

    async onPermCheck(bot, msg) {
        if (!msg.member.permission.has('banMembers')) return false;
        else return true;
    }
}
module.exports = BanList;